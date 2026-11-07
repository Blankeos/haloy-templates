#!/usr/bin/env bun
import { mkdir, writeFile, chmod, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fetchTemplate, listTemplates, trimCache } from "./fetch";
import { translate, type Result } from "./translate";

const USAGE = `haloy-templates

  haloy-templates translate <template-id> [--domain d] [--server s] [--out dir]
  haloy-templates all [--out dir] [--only a,b] [--limit n]   translate every Dokploy template + COVERAGE.md
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

async function write(out: string, r: Result) {
  for (const [p, c] of Object.entries(r.files)) {
    const file = join(out, r.id, p);
    // never overwrite generated secrets of an existing deployment
    if (p === ".env" && (await access(file).then(() => true, () => false))) continue;
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, c);
    if (p === "deploy.sh") await chmod(file, 0o755);
  }
}

async function one(id: string, o: { domain?: string; server?: string }) {
  const t = await fetchTemplate(id);
  return translate({ id, ...t, ...o });
}

const [cmd, ...rest] = process.argv.slice(2);
const { f, pos } = flags(rest);
if (cmd === "translate" && pos[0]) {
  const r = await one(pos[0], { domain: f.domain, server: f.server });
  await write(f.out ?? "./out", r);
  console.log(`${r.id}: ${r.status} (${r.targets.length} targets, ${r.warnings.length} warnings) -> ${join(f.out ?? "./out", r.id)}`);
} else if (cmd === "all") {
  const ids = f.only ? f.only.split(",") : (await listTemplates()).slice(0, f.limit ? Number(f.limit) : undefined);
  const results: Result[] = [];
  const errors: { id: string; error: string }[] = [];
  for (let i = 0; i < ids.length; i += 8) {
    await Promise.all(ids.slice(i, i + 8).map(async (id) => {
      try { const r = await one(id, { domain: f.domain, server: f.server }); await write(f.out ?? "./out", r); results.push(r); }
      catch (e: any) { errors.push({ id, error: String(e.message ?? e) }); }
    }));
  }
  await trimCache();
  const count = (s: string) => results.filter((r) => r.status === s).length;
  const codes: Record<string, number> = {};
  results.forEach((r) => new Set(r.warnings.map((w) => w.code)).forEach((c) => (codes[c] = (codes[c] ?? 0) + 1)));
  const md = `# Coverage\n\n${results.length} templates: **${count("ok")} ok**, ${count("partial")} partial (workarounds applied), ${count("manual")} manual, ${errors.length} failed to translate.\n\n## Most common warnings\n\n${Object.entries(codes).sort((a, b) => b[1] - a[1]).map(([c, n]) => `- \`${c}\`: ${n}`).join("\n")}\n\n## Failures\n\n${errors.map((e) => `- ${e.id}: ${e.error}`).join("\n") || "None."}\n\n## Per template\n\n${results.sort((a, b) => a.id.localeCompare(b.id)).map((r) => `- ${r.id}: ${r.status}`).join("\n")}\n`;
  await mkdir(f.out ?? "./out", { recursive: true });
  await writeFile(join(f.out ?? "./out", "COVERAGE.md"), md);
  console.log(md.split("\n").slice(0, 3).join("\n"));
} else {
  console.log(USAGE);
}
