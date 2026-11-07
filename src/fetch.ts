import { mkdir, readFile, writeFile, readdir, stat, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const RAW = "https://raw.githubusercontent.com/Dokploy/templates/canary/blueprints";
const CACHE = process.env.HALOY_TEMPLATES_CACHE ?? join(homedir(), ".cache", "haloy-templates");
const MAX_BYTES = 20 * 1024 * 1024;

async function cached(path: string, url: string): Promise<string | null> {
  const file = join(CACHE, path);
  try { return await readFile(file, "utf8"); } catch {}
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const text = await res.text();
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, text);
  return text;
}

export async function fetchTemplate(id: string) {
  const compose = await cached(`${id}/docker-compose.yml`, `${RAW}/${id}/docker-compose.yml`);
  if (!compose) throw new Error(`template '${id}' not found`);
  const templateToml = await cached(`${id}/template.toml`, `${RAW}/${id}/template.toml`);
  return { compose, templateToml: templateToml ?? undefined };
}

export async function listTemplates(): Promise<string[]> {
  const res = await fetch("https://api.github.com/repos/Dokploy/templates/contents/blueprints", {
    headers: { "user-agent": "haloy-templates", ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
  });
  if (!res.ok) throw new Error(`listing templates: ${res.status}`);
  return ((await res.json()) as { name: string; type: string }[]).filter((e) => e.type === "dir").map((e) => e.name);
}

/** Keep the cache under MAX_BYTES by dropping the oldest template folders. */
export async function trimCache() {
  let dirs: { p: string; t: number; s: number }[] = [];
  try {
    for (const d of await readdir(CACHE)) {
      const p = join(CACHE, d);
      let s = 0;
      for (const f of await readdir(p)) s += (await stat(join(p, f))).size;
      dirs.push({ p, t: (await stat(p)).mtimeMs, s });
    }
  } catch { return; }
  let total = dirs.reduce((a, d) => a + d.s, 0);
  for (const d of dirs.sort((a, b) => a.t - b.t)) {
    if (total <= MAX_BYTES) break;
    await rm(d.p, { recursive: true, force: true });
    total -= d.s;
  }
}

export async function upstreamSha(): Promise<string> {
  const res = await fetch("https://api.github.com/repos/Dokploy/templates/commits/canary", {
    headers: { "user-agent": "haloy-templates", accept: "application/vnd.github.sha", ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
  });
  if (!res.ok) throw new Error(`upstream sha: ${res.status}`);
  return (await res.text()).trim();
}
