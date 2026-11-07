#!/usr/bin/env bun
import { access, chmod, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fetchTemplate, listTemplates, trimCache, upstreamSha } from "./fetch";
import { buildEnv, type Vars } from "./secrets";
import { translate, type Result } from "./translate";

export const PLACEHOLDER_DOMAIN = "app.example.com";
const ROOT = join(import.meta.dir, "..");
const TEMPLATES = join(ROOT, "templates");

const USAGE = `haloy-templates

  list                                     list bundled templates
  add <id> [--domain d] [--server s] [--out dir]   copy a bundled template and generate its .env
  env <id>                                 print a freshly generated .env for a template
  translate <id> [--domain d] [--out dir]  translate straight from upstream (dev)
  sync [--only a,b] [--limit n]            re-translate upstream into templates (maintainers)
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
    if (p === "haloy.yaml") {
      if (domain) text = text.replaceAll(PLACEHOLDER_DOMAIN, domain);
      if (server) text = text.replace(/^server: localhost$/m, `server: ${server}`);
    }
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
  const t = await fetchTemplate(pos[0]);
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
  console.log(`synced ${results.length} templates (${errors.length} failed). clean=${count("ok")} partial=${count("partial")} manual=${count("manual")}`);
} else {
  console.log(USAGE);
}
