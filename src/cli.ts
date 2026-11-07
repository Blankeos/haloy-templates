#!/usr/bin/env bun
import { access, chmod, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fetchTemplate, listTemplates, trimCache, upstreamSha } from "./fetch";
import { buildEnv, type Vars } from "./secrets";
import { badgesFor, hashTemplate, readStatus, writeStatus, withBadges } from "./status";
import { translate, type Result } from "./translate";

export const PLACEHOLDER_DOMAIN = "app.example.com";
const ROOT = join(import.meta.dir, "..");
const TEMPLATES = join(ROOT, "templates");

const USAGE = `haloy-templates

  list                                     list bundled templates
  add <id> [--domain d] [--server s] [--platform p] [--out dir]   copy a bundled template and generate its .env
  env <id>                                 print a freshly generated .env for a template
  translate <id> [--domain d] [--out dir] [--compose f [--toml f]]   translate from upstream, or from your own files
  sync [--only a,b] [--limit n]            re-translate upstream into templates (maintainers)
  record verified --haloy v <id>...        mark templates as passing \`haloy validate-config\`
  record tested <id> --haloy v --arch a --notes "..."   mark a template as deployed and healthy
  badges                                   rewrite badges in every REPORT.md and the README summary
`;

function flags(args: string[]) {
  const f: Record<string, string> = {};
  const pos: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) f[args[i].slice(2)] = args[++i];
    else pos.push(args[i]);
  }
  return { f, pos };
}

const exists = (p: string) => access(p).then(() => true, () => false);

async function writeFiles(dir: string, files: Record<string, string>) {
  for (const [p, c] of Object.entries(files)) {
    const file = join(dir, p);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, c);
    if (p === "deploy.sh") await chmod(file, 0o755);
  }
}

async function readTree(dir: string, base = dir): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) Object.assign(out, await readTree(p, base));
    else out[p.slice(base.length + 1)] = await readFile(p, "utf8");
  }
  return out;
}

async function bundled(id: string) {
  const dir = join(TEMPLATES, id);
  if (!(await exists(dir))) throw new Error(`no bundled template '${id}' (try: list)`);
  return { dir, files: await readTree(dir) };
}


const MARK = ["<!-- status:start -->", "<!-- status:end -->"];

/** Writes badges into every REPORT.md and the summary into README.md. */
async function applyBadges() {
  const st = await readStatus(ROOT);
  const ids = (await readdir(TEMPLATES, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  let verified = 0;
  const tested: string[] = [];
  for (const id of ids) {
    const dir = join(TEMPLATES, id);
    const b = badgesFor(id, await hashTemplate(dir), st);
    if (b.some((x) => x.startsWith("✅"))) verified++;
    if (b.some((x) => x.startsWith("🟢"))) tested.push(id);
    const file = join(dir, "REPORT.md");
    const next = withBadges(await readFile(file, "utf8"), b);
    await writeFile(file, next);
  }
  const counts: Record<string, number> = {};
  for (const id of ids) {
    const st2 = /Status: \*\*(\w+)\*\*/.exec(await readFile(join(TEMPLATES, id, "REPORT.md"), "utf8"))?.[1] ?? "unknown";
    counts[st2] = (counts[st2] ?? 0) + 1;
  }
  const rows = tested.map((id) => {
    const t = st.tested[id];
    return `| [\`${id}\`](templates/${id}) | ${t.notes} | ${t.arch} | ${t.date} |`;
  });
  const block = `${MARK[0]}
| | |
|---|---|
| ✅ **verified** (\`haloy validate-config\` passes) | ${verified} / ${ids.length} |
| 🟢 **tested** (deployed, healthy, answers requests) | ${tested.length} / ${ids.length} |
| 🧩 **translation** | ${counts.ok ?? 0} clean, ${counts.partial ?? 0} with workarounds, ${counts.manual ?? 0} need a human |

${tested.length ? `| 🟢 Tested | What was checked | Arch | Date |\n|---|---|---|---|\n${rows.join("\n")}` : "No template is deploy-tested yet."}
${MARK[1]}`;
  const readmePath = join(ROOT, "README.md");
  const readme = await readFile(readmePath, "utf8");
  const a = readme.indexOf(MARK[0]);
  const z = readme.indexOf(MARK[1]);
  if (a >= 0 && z > a) await writeFile(readmePath, readme.slice(0, a) + block + readme.slice(z + MARK[1].length));
  return { verified, tested: tested.length, total: ids.length };
}

const [cmd, ...rest] = process.argv.slice(2);
const { f, pos } = flags(rest);

if (cmd === "list") {
  const index: { id: string; status: string; targets: number }[] = JSON.parse(await readFile(join(TEMPLATES, "index.json"), "utf8"));
  for (const t of index) console.log(`${t.id.padEnd(40)} ${t.status.padEnd(8)} ${t.targets} targets`);
} else if (cmd === "add" && pos[0]) {
  const { files } = await bundled(pos[0]);
  const out = join(f.out ?? ".", pos[0]);
  const domain = f.domain;
  const server = f.server;
  const next: Record<string, string> = {};
  for (const [p, c] of Object.entries(files)) {
    if (p === "vars.json") continue;
    let text = c;
    if (domain && p !== "REPORT.md") text = text.replaceAll(PLACEHOLDER_DOMAIN, domain);
    if (f.platform && p === "haloy.yaml") text = text.replace(/^( +)push: server$/gm, `$1push: server\n$1platform: ${f.platform}`);
    if (server && p === "haloy.yaml") text = text.replace(/^server: localhost$/m, `server: ${server}`);
    next[p] = text;
  }
  if (files["vars.json"] && !(await exists(join(out, ".env")))) next[".env"] = buildEnv(JSON.parse(files["vars.json"]) as Vars);
  next[".gitignore"] = ".env\n";
  await writeFiles(out, next);
  console.log(`${pos[0]} -> ${out}${domain ? "" : `  (domain is the placeholder ${PLACEHOLDER_DOMAIN}; pass --domain)`}\nnext: cd ${out} && cat REPORT.md && ./deploy.sh`);
} else if (cmd === "env" && pos[0]) {
  const { files } = await bundled(pos[0]);
  if (files["vars.json"]) process.stdout.write(buildEnv(JSON.parse(files["vars.json"]) as Vars));
} else if (cmd === "translate" && pos[0]) {
  // --compose/--toml translate your own files (e.g. a stack that is already deployed) instead of an upstream template
  const t = f.compose
    ? { compose: await readFile(f.compose, "utf8"), templateToml: f.toml ? await readFile(f.toml, "utf8") : undefined }
    : await fetchTemplate(pos[0]);
  const r = translate({ id: pos[0], ...t, domain: f.domain ?? PLACEHOLDER_DOMAIN });
  await writeFiles(join(f.out ?? "./out", r.id), r.files);
  console.log(`${r.id}: ${r.status} (${r.targets.length} targets, ${r.warnings.length} warnings)`);
} else if (cmd === "sync") {
  const all = await listTemplates();
  const ids = f.only ? f.only.split(",") : all.slice(0, f.limit ? Number(f.limit) : undefined);
  const results: Result[] = [];
  const errors: { id: string; error: string }[] = [];
  for (let i = 0; i < ids.length; i += 8) {
    await Promise.all(ids.slice(i, i + 8).map(async (id) => {
      try {
        const t = await fetchTemplate(id);
        results.push(translate({ id, ...t, domain: PLACEHOLDER_DOMAIN }));
      } catch (e: any) { errors.push({ id, error: String(e.message ?? e) }); }
    }));
  }
  results.sort((a, b) => a.id.localeCompare(b.id));
  const full = !f.only && !f.limit;
  for (const r of results) {
    await rm(join(TEMPLATES, r.id), { recursive: true, force: true });
    await writeFiles(join(TEMPLATES, r.id), r.files);
  }
  if (full) {
    for (const d of await readdir(TEMPLATES, { withFileTypes: true })) {
      if (d.isDirectory() && !all.includes(d.name)) await rm(join(TEMPLATES, d.name), { recursive: true, force: true });
    }
  }
  // index + coverage cover everything bundled, not just this run
  const index: { id: string; status: string; targets: number }[] = [];
  for (const d of (await readdir(TEMPLATES, { withFileTypes: true })).filter((d) => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const report = await readFile(join(TEMPLATES, d.name, "REPORT.md"), "utf8");
    const status = /Status: \*\*(\w+)\*\*/.exec(report)?.[1] ?? "unknown";
    const yaml = await readFile(join(TEMPLATES, d.name, "haloy.yaml"), "utf8");
    index.push({ id: d.name, status, targets: (yaml.match(/^ {2}[\w-]+:$/gm) ?? []).length });
  }
  await writeFile(join(TEMPLATES, "index.json"), JSON.stringify(index, null, 1) + "\n");
  const count = (s: string) => index.filter((t) => t.status === s).length;
  const codes: Record<string, number> = {};
  for (const t of index) {
    const report = await readFile(join(TEMPLATES, t.id, "REPORT.md"), "utf8");
    new Set([...report.matchAll(/^- \[\w+\] (?:`[^`]+` )?([\w-]+):/gm)].map((m) => m[1])).forEach((c) => (codes[c] = (codes[c] ?? 0) + 1));
  }
  if (full) await writeFile(join(TEMPLATES, "UPSTREAM"), (await upstreamSha()) + "\n");
  await writeFile(join(ROOT, "COVERAGE.md"),
    `# Coverage\n\n${index.length} templates: **${count("ok")} clean**, ${count("partial")} with workarounds, ${count("manual")} needing manual work.\n\nUpstream: Dokploy/templates @ \`${(await readFile(join(TEMPLATES, "UPSTREAM"), "utf8").catch(() => "unknown")).trim()}\`\n\n## Warnings by frequency\n\n${Object.entries(codes).sort((a, b) => b[1] - a[1]).map(([c, n]) => `- \`${c}\`: ${n}`).join("\n")}\n\n## Failed to translate\n\n${errors.map((e) => `- ${e.id}: ${e.error}`).join("\n") || "None."}\n`);
  await trimCache();
  await applyBadges();
  console.log(`synced ${results.length} templates (${errors.length} failed). clean=${count("ok")} partial=${count("partial")} manual=${count("manual")}`);
} else if (cmd === "record" && pos[0] === "verified") {
  const st = await readStatus(ROOT);
  const date = new Date().toISOString().slice(0, 10);
  for (const id of pos.slice(1)) st.verified[id] = { hash: await hashTemplate(join(TEMPLATES, id)), date, haloy: f.haloy ?? "unknown" };
  await writeStatus(ROOT, st);
  console.log("recorded", await applyBadges());
} else if (cmd === "record" && pos[0] === "tested" && pos[1]) {
  const st = await readStatus(ROOT);
  const id = pos[1];
  if (!f.notes) throw new Error("--notes is required: say what was actually checked");
  st.tested[id] = { hash: await hashTemplate(join(TEMPLATES, id)), date: new Date().toISOString().slice(0, 10), haloy: f.haloy ?? "unknown", arch: f.arch ?? "unknown", notes: f.notes };
  await writeStatus(ROOT, st);
  console.log("recorded", await applyBadges());
} else if (cmd === "badges") {
  console.log(await applyBadges());
} else {
  console.log(USAGE);
}
