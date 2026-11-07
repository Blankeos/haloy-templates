import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

export interface Tested { hash: string; date: string; haloy: string; arch: string; notes: string }
export interface Status {
  /** id -> content hash at the time `haloy validate-config` passed */
  verified: Record<string, { hash: string; date: string; haloy: string }>;
  /** id -> proof that it was deployed and answered healthy */
  tested: Record<string, Tested>;
}

export const VERIFIED = "✅ verified";
export const TESTED = "🟢 tested";

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out.sort();
}

/** Hash of everything that gets deployed. REPORT.md is excluded because it carries the badges. */
export async function hashTemplate(dir: string): Promise<string> {
  const h = createHash("sha1");
  for (const p of await walk(dir)) {
    const rel = relative(dir, p);
    if (rel === "REPORT.md") continue;
    h.update(rel + "\0" + (await readFile(p)) + "\0");
  }
  return h.digest("hex");
}

export async function readStatus(root: string): Promise<Status> {
  try { return JSON.parse(await readFile(join(root, "status.json"), "utf8")); }
  catch { return { verified: {}, tested: {} }; }
}

export async function writeStatus(root: string, s: Status) {
  const sort = <T,>(o: Record<string, T>) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(join(root, "status.json"), JSON.stringify({ verified: sort(s.verified), tested: sort(s.tested) }, null, 1) + "\n");
}

/** Badges that are true for this exact content of the template. */
export function badgesFor(id: string, hash: string, s: Status): string[] {
  const out: string[] = [];
  const v = s.verified[id];
  const t = s.tested[id];
  if (v && v.hash === hash) out.push(`${VERIFIED} (haloy ${v.haloy}, ${v.date})`);
  if (t && t.hash === hash) out.push(`${TESTED} (${t.arch}, haloy ${t.haloy}, ${t.date}): ${t.notes}`);
  return out;
}

/** Rewrites the badge block in a REPORT.md, right under the `Status:` line. */
export function withBadges(report: string, badges: string[]): string {
  const lines = report.split("\n").filter((l) => !l.startsWith("Badge: "));
  const i = lines.findIndex((l) => l.startsWith("Status: "));
  const block = badges.length ? badges.map((b) => `Badge: ${b}`) : ["Badge: ⚪ not verified"];
  lines.splice(i + 1, 0, ...block);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}
