import { randomBytes, randomUUID } from "node:crypto";

export interface Vars {
  /** ENV_NAME -> generator spec, e.g. "password:32" */
  secrets: Record<string, string>;
  /** ENV_NAME -> template string that embeds secrets as ${NAME} */
  derived: Record<string, string>;
}

export function genSecret(spec: string): string {
  const [kind, arg] = spec.split(":");
  const n = Number(arg) || 32;
  if (kind === "password") {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(randomBytes(n), (b) => chars[b % chars.length]).join("");
  }
  if (kind === "base64") return randomBytes(n).toString("base64");
  if (kind === "hash") return randomBytes(Math.ceil(n / 2)).toString("hex").slice(0, n);
  if (kind === "uuid") return randomUUID();
  return randomBytes(24).toString("hex");
}

const q = (v: string) => `'${v.replace(/'/g, `'\\''`)}'`;

/** Build the contents of a .env file from vars.json. */
export function buildEnv(vars: Vars, gen: (spec: string) => string = genSecret): string {
  const values: Record<string, string> = {};
  for (const [k, spec] of Object.entries(vars.secrets)) values[k] = gen(spec);
  const derived: Record<string, string> = {};
  for (const [k, tpl] of Object.entries(vars.derived)) {
    derived[k] = tpl.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (m, n) => values[n] ?? derived[n] ?? m);
  }
  return [...Object.entries(values), ...Object.entries(derived)].map(([k, v]) => `${k}=${q(v)}`).join("\n") + "\n";
}
