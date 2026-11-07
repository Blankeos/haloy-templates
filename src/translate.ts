import { parse as parseYaml, stringify as toYaml } from "yaml";
import { parse as parseToml } from "smol-toml";
import { randomBytes, randomUUID } from "node:crypto";

export type Level = "partial" | "manual";
export interface Warning {
  level: Level;
  target?: string;
  code: string;
  message: string;
}
export interface Result {
  id: string;
  status: "ok" | "partial" | "manual";
  warnings: Warning[];
  files: Record<string, string>;
  targets: string[];
}
export interface Input {
  id: string;
  compose: string;
  templateToml?: string;
  /** Public hostname the app should be served on. */
  domain?: string;
  /** Haloy server the generated config points at. */
  server?: string;
  /** Fixed seed for secrets (tests). */
  secretFor?: (name: string, spec: string) => string;
}

const DB_IMAGES = new Set([
  "postgres", "pgvector", "mysql", "mariadb", "mongo", "redis", "valkey",
  "clickhouse-server", "clickhouse", "timescaledb", "elasticsearch", "opensearch",
  "memcached", "cassandra", "couchdb", "influxdb", "rabbitmq", "nats", "keydb",
]);
const IMAGE_PORTS: Record<string, string> = {
  postgres: "5432", pgvector: "5432", timescaledb: "5432", mysql: "3306", mariadb: "3306",
  mongo: "27017", redis: "6379", valkey: "6379", keydb: "6379", "clickhouse-server": "8123",
  clickhouse: "8123", elasticsearch: "9200", opensearch: "9200", memcached: "11211",
  rabbitmq: "5672", nats: "4222", couchdb: "5984", influxdb: "8086", cassandra: "9042",
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const upper = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^(\d)/, "T_$1");
const imageName = (image: string) => image.split("/").pop()!.split(":")[0].split("@")[0];

function genSecret(spec: string): string {
  const [kind, arg] = spec.split(":");
  const n = Number(arg) || 32;
  if (kind === "password") {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const bytes = randomBytes(n);
    return Array.from(bytes, (b) => chars[b % chars.length]).join("");
  }
  if (kind === "base64") return randomBytes(n).toString("base64");
  if (kind === "hash") return randomBytes(Math.ceil(n / 2)).toString("hex").slice(0, n);
  if (kind === "uuid") return randomUUID();
  return randomBytes(24).toString("hex");
}
const HELPER = /^\$\{(password|base64|hash|uuid|jwt|randomPort)(?::[^}]*)?\}$/;

/** Compose-level `$${VAR}` is an escaped literal `${VAR}`. */
const ESC = "\u0000";
const LIT = "\u0001";

export function translate(input: Input): Result {
  const { id } = input;
  const warnings: Warning[] = [];
  const warn = (level: Level, code: string, message: string, target?: string) =>
    warnings.push({ level, code, message, target });
  const files: Record<string, string> = {};
  const compose: any = parseYaml(input.compose, { merge: true }) ?? {};
  const tpl: any = input.templateToml ? parseToml(input.templateToml) : {};
  const domain = input.domain ?? "example.com";

  // ---- template variables ------------------------------------------------
  const secrets: Record<string, string> = {}; // ENV_NAME -> value
  const needInput = new Set<string>(); // vars the user must supply
  const derived: Record<string, string> = {}; // composed env strings that embed secrets
  const secretVars = new Set<string>(); // template variable names that are secrets
  const plain: Record<string, string> = {};
  const gen = input.secretFor ?? ((_n: string, spec: string) => genSecret(spec));
  const rawVars: Record<string, string> = { ...(tpl.variables ?? {}) };
  for (const [k, v] of Object.entries(rawVars)) {
    const s = String(v);
    if (HELPER.test(s)) {
      if (/^\$\{randomPort\}$/.test(s)) plain[k] = "8080";
      else {
        secretVars.add(k);
        secrets[upper(k)] = gen(k, s.slice(2, -1));
      }
    }
  }
  const subTpl = (s: string, depth = 0): string =>
    s.replace(/\$\{([^}]+)\}/g, (m, name: string) => {
      if (name === "domain") return domain;
      if (name === "email") return `admin@${domain}`;
      if (name === "username") return "admin";
      if (secretVars.has(name)) return "${" + upper(name) + "}";
      if (name in rawVars && depth < 5 && !HELPER.test(String(rawVars[name]))) {
        return subTpl(String(rawVars[name]), depth + 1);
      }
      if (/^(password|base64|hash|uuid|jwt)/.test(name)) {
        const key = upper("INLINE_" + name.replace(/[^a-z0-9]+/gi, "_"));
        secrets[key] ??= gen(key, name);
        return "${" + key + "}";
      }
      return m;
    });
  for (const [k, v] of Object.entries(rawVars)) if (!secretVars.has(k) && !(k in plain)) plain[k] = subTpl(String(v));

  const tplEnv: Record<string, string> = {};
  const cfg = tpl.config ?? {};
  for (const [k, v] of Object.entries(cfg.env ?? {})) tplEnv[k] = subTpl(String(v));
  if (Array.isArray(cfg.env)) {
    tplEnv; // list form: ["K=V"]
    for (const e of cfg.env) {
      const i = String(e).indexOf("=");
      if (i > 0) tplEnv[String(e).slice(0, i)] = subTpl(String(e).slice(i + 1));
    }
  }

  // ---- naming ------------------------------------------------------------
  const services: Record<string, any> = compose.services ?? {};
  const names: Record<string, string> = {};
  for (const svc of Object.keys(services)) {
    let n = slug(svc);
    const prefix = slug(id);
    if (!n.startsWith(prefix)) n = `${prefix}-${n}`;
    names[svc] = n;
  }
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  /** Rewrite compose service names to Haloy target names, only where they are used as hostnames. */
  const renameHosts = (s: string, varName?: string) => {
    let out = s;
    for (const svc of Object.keys(names).sort((a, b) => b.length - a.length)) {
      const to = names[svc];
      if (svc === to) continue;
      const e = esc(svc);
      if (out === svc && varName && /(HOST|ADDR|SERVER|URL|URI|ENDPOINT|DSN|DOMAIN)/i.test(varName)) { out = to; continue; }
      out = out.replace(new RegExp(`@${e}(?=[:/?]|$)`, "g"), `@${to}`);
      out = out.replace(new RegExp(`(?<![\\w-])${e}(?=:\\d)`, "g"), to);
      if (!out.includes("@")) out = out.replace(new RegExp(`(\\w+://)${e}(?=[:/?]|$)`, "g"), `$1${to}`);
    }
    return out;
  };
  /** Resolve compose-level `${VAR}` against template env, keeping secrets as haloy-time `${VAR}`. */
  const resolve = (s: string, target: string, varName?: string, depth = 0): string => {
    const guarded = s.replace(/\$\$/g, ESC);
    const out = guarded.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)(?::?([-?+])([^}]*))?\}|\$([A-Za-z_][A-Za-z0-9_]*)/g, (m, a, op, arg, b) => {
      const name = a ?? b;
      if (secrets[name] !== undefined || secretVars.has(name)) return "${" + upper(name) + "}";
      if (name in tplEnv && tplEnv[name] === "${" + name + "}") { needInput.add(name); return ""; }
      if (name in tplEnv) {
        const v = tplEnv[name];
        return /\$\{[^}]+\}/.test(v) && depth < 4 ? resolve(v, target, undefined, depth + 1) : v;
      }
      if (name in plain) return plain[name];
      if (name === "DOMAIN") return domain;
      if (op === "-") return arg;
      if (op === "+") return arg;
      needInput.add(name); // compose semantics: unset => empty
      return "";
    });
    return renameHosts(out.replaceAll(ESC, "$"), varName);
  };

  // ---- domains from template.toml ---------------------------------------
  const domainsBySvc: Record<string, { host: string; port?: string; path?: string }[]> = {};
  for (const d of cfg.domains ?? []) {
    (domainsBySvc[d.serviceName] ??= []).push({ host: subTpl(String(d.host ?? domain)), port: d.port != null ? String(d.port) : undefined, path: d.path });
  }

  // ---- per-service -------------------------------------------------------
  const targets: Record<string, any> = {};
  const order: { name: string; deps: string[] }[] = [];
  const mounts: { filePath: string; content: string }[] = (cfg.mounts ?? []).map((m: any) => ({
    filePath: String(m.filePath).replace(/^\.\//, ""),
    content: String(m.content ?? ""),
  }));
  const volumePrefix = slug(id);
  const volumeDecl = compose.volumes ?? {};

  for (const [svc, def] of Object.entries<any>(services)) {
    const t = names[svc];
    const out: any = {};
    let needsDockerfile = false;
    const df: string[] = [];
    if (!def.image && def.build) {
      warn("manual", "build", "service uses `build:`; template must be built from its own source and pushed to a registry first", t);
    }
    const image: string = def.image ?? `${slug(id)}-${slug(svc)}`;
    const base = imageName(image);

    // unsupported features
    for (const [key, why] of [
      ["privileged", "privileged mode"], ["network_mode", "custom network_mode"], ["devices", "device passthrough"],
      ["cap_add", "extra capabilities"], ["pid", "host pid namespace"], ["sysctls", "sysctls"],
      ["env_file", "env_file (inline the values)"],
    ] as const) if (def[key]) warn("manual", `unsupported-${key}`, `${why} has no Haloy equivalent`, t);
    if (def.deploy?.resources) warn("partial", "resources", "resource limits dropped (Haloy has no limit fields)", t);

    // entrypoint / command
    const toArr = (v: any) => (v == null ? undefined : Array.isArray(v) ? v.map(String) : ["sh", "-c", String(v)]);
    const rs = (a?: string[]) => a?.map((x) => resolve(x, t));
    const entry = rs(toArr(def.entrypoint));
    const cmd = rs(toArr(def.command));
    if (entry || cmd) needsDockerfile = true;

    // env
    const envList: { name: string; value: string }[] = [];
    const rawEnv = def.environment;
    const pairs: [string, string][] = Array.isArray(rawEnv)
      ? rawEnv.map((e: string) => { const i = e.indexOf("="); return i < 0 ? [e, `\${${e}}`] : [e.slice(0, i), e.slice(i + 1)]; })
      : Object.entries(rawEnv ?? {}).map(([k, v]) => [k, v == null ? `\${${k}}` : String(v)]);
    for (const [k, v] of pairs) {
      if (/\$\$\{?[A-Za-z_]/.test(v) && !/\$\{[^}]+\}/.test(v.replace(/\$\$/g, ""))) {
        warn("partial", "shell-var-in-env", `${k} contains a literal $VAR meant for the container shell; Haloy would interpolate it, so it was omitted`, t);
        continue;
      }
      const value = resolve(v, t, k);
      if (value === "") continue;
      envList.push({ name: k, value });
    }

    // volumes
    const vols: string[] = [];
    for (const v of def.volumes ?? []) {
      const str = resolve(typeof v === "string" ? v : `${v.source}:${v.target}`, t);
      const parts = str.split(":");
      const src = parts[0];
      const dst = parts[1];
      const ro = parts[2] === "ro";
      if (!dst) continue;
      if (/^(\.|\.\.)\/|^\.$/.test(src)) {
        const rel = src.replace(/^(\.\.\/files\/|\.\/|\.\.\/)/, "");
        const matched = mounts.filter((m) => m.filePath === rel || m.filePath.startsWith(rel.replace(/\/$/, "") + "/"));
        if (matched.length) {
          needsDockerfile = true;
          for (const m of matched) files[`${t}/${m.filePath}`] = m.content;
          const exact = matched.some((m) => m.filePath === rel);
          df.push(`COPY ${rel} ${dst}${exact || dst.endsWith("/") ? "" : "/"}`.replace(/\s+$/, ""));
          continue;
        }
        if (!/\.[A-Za-z0-9]+$/.test(rel)) {
          vols.push(`${volumePrefix}-${slug(rel)}:${dst}${ro ? ":ro" : ""}`);
          continue;
        }
        warn("partial", "bind-mount", `bind mount ${src} is a file with no matching content in template.toml; dropped`, t);
        continue;
      }
      if (src.startsWith("/")) {
        if (src.includes("docker.sock")) warn("manual", "docker-sock", "mounts the Docker socket", t);
        else warn("partial", "host-path", `host path ${src} mounted as-is; make sure it exists on the server`, t);
        vols.push(`${src}:${dst}${ro ? ":ro" : ""}`);
        continue;
      }
      if (!(src in volumeDecl) && volumeDecl && !Object.hasOwn(volumeDecl, src)) volumeDecl[src] = null;
      vols.push(`${volumePrefix}-${slug(src)}:${dst}${ro ? ":ro" : ""}`);
    }

    // domains / port / health
    const doms = domainsBySvc[svc] ?? [];
    const domainEntries: { domain: string }[] = [];
    let port: string | undefined = doms.find((d) => d.port)?.port;
    for (const d of doms) {
      let host = d.host;
      host = host.replace(/_/g, "-");
      if (!host.includes(".")) host = `${host}.${domain}`;
      if (d.path && d.path !== "/") {
        const seg = slug(d.path) || "app";
        host = `${seg}.${host}`;
        warn("partial", "path-routing", `Haloy routes by hostname only; ${d.path} on ${d.host} became ${host}. Point DNS there and update any URL env vars (e.g. BASE_URL).`, t);
      }
      if (!domainEntries.some((e) => e.domain === host)) domainEntries.push({ domain: host });
    }
    if (!port) {
      const exp = (def.expose ?? [])[0];
      const prt = (def.ports ?? [])[0];
      const cp = (x: any) => (x == null ? undefined : resolve(String(typeof x === "object" ? x.target : x), t).split(":").pop()!.split("/")[0]);
      port = cp(exp) ?? cp(prt);
    }
    if (def.ports?.length && domainEntries.length === 0) {
      warn("partial", "host-ports", `published host ports (${def.ports.join(", ")}) are not exposed by Haloy; use \`haloy tunnel\` or add a domain`, t);
    }
    if (!port) {
      port = IMAGE_PORTS[base];
      if (!port) { port = "8080"; if (domainEntries.length) warn("partial", "guessed-port", "could not determine the container port; defaulted to 8080", t); }
    }
    const hc = def.healthcheck?.test;
    if (hc) {
      const text = Array.isArray(hc) ? hc.join(" ") : String(hc);
      const m = text.match(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(\/[^\s"'\]]*)?/);
      if (m) out.health_check_path = m[1] ?? "/";
      else if (!DB_IMAGES.has(base)) warn("partial", "healthcheck", "command-style healthcheck dropped (Haloy supports HTTP path checks only)", t);
    }

    const stateful = DB_IMAGES.has(base);
    if (stateful) out.preset = "database";
    else if (domainEntries.length === 0) out.preset = "service";

    if (needsDockerfile) {
      df.unshift(`FROM ${image}`);
      // Dockerfile exec-form does not expand env; wrap in `sh -c` when a value is a deploy-time ${VAR}.
      const addEnv = (x: string) => x.replace(/\$\{([A-Z0-9_]+)\}/g, (m, n) => { if (n in secrets && !envList.some((e) => e.name === n)) envList.push({ name: n, value: "${" + n + "}" }); return m; });
      const alreadyShell = (a: string[]) => /^(sh|bash|ash|\/bin\/(ba)?sh)$/.test(a[0]) && a[1] === "-c";
      const shellForm = (a: string[]) => {
        a.forEach(addEnv);
        if (alreadyShell(a) || !a.some((x) => /\$\{[A-Z0-9_]+\}/.test(x))) return a;
        return ["sh", "-c", "exec " + a.map((x) => (/\$\{[A-Z0-9_]+\}/.test(x) ? `"${x.replace(/"/g, '\\"')}"` : /^[\w./:=@%+,-]+$/.test(x) ? x : `'${x.replace(/'/g, `'\\''`)}'`)).join(" ")];
      };
      const entryF = entry && shellForm(entry);
      const cmdF = cmd && shellForm(cmd);
      if (entryF) df.push(`ENTRYPOINT ${JSON.stringify(entryF)}`);
      if (cmdF) df.push(`CMD ${JSON.stringify(cmdF)}`);
      files[`${t}/Dockerfile`] = df.join("\n") + "\n";
      out.image = { repository: t, tag: "latest", build_config: { context: `./${t}`, push: "server" } };
    } else {
      out.image = image;
    }
    if (/[-,]/.test(port) && /^\d/.test(port)) {
      warn("partial", "port-range", `port range ${port} is not supported; using ${port.split(/[-,]/)[0]}`, t);
      port = port.split(/[-,]/)[0];
    }
    out.port = port;
    if (domainEntries.length) out.domains = domainEntries;
    if (envList.length) {
      out.env = envList.map((e) => {
        const m = /^\$\{([A-Za-z_][A-Za-z0-9_]*)\}$/.exec(e.value);
        if (m) return { name: e.name, from: { env: m[1] } };
        // Haloy does not interpolate ${VAR} inside `value`, so composed strings that contain a
        // generated secret become a derived variable in .env, read with `from: env`.
        if (/\$\{[A-Za-z_][A-Za-z0-9_]*\}/.test(e.value)) {
          const composed = e.value.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (mm, n) => (n in secrets ? secrets[n] : mm));
          if (!/\$\{[A-Za-z_]/.test(composed)) {
            const key = `${upper(t)}__${e.name}`;
            derived[key] = composed;
            return { name: e.name, from: { env: key } };
          }
        }
        return e;
      });
    }
    if (vols.length) out.volumes = vols;
    if (def.restart && def.restart !== "unless-stopped" && def.restart !== "always") {
      /* haloy always restarts unless stopped */
    }
    targets[t] = out;
    const deps = Array.isArray(def.depends_on) ? def.depends_on : Object.keys(def.depends_on ?? {});
    order.push({ name: t, deps: deps.map((d: string) => names[d]).filter(Boolean) });
  }

  // services referenced by others by hostname must be domainless (static name)
  for (const [svc, def] of Object.entries<any>(services)) {
    const t = names[svc];
    if (!targets[t].domains) continue;
    const referenced = Object.values<any>(targets).some((o: any) => o !== targets[t] && (o.env ?? []).some((e: any) => new RegExp(`(?<![\\w-])${t}(?![\\w-])`).test(String(e.value))));
    if (referenced) warn("partial", "internal-ref-to-public", `${t} is reached by hostname from another service but has a domain; with rolling deploys its container name changes`, t);
  }

  // ---- deploy order ------------------------------------------------------
  const sorted: string[] = [];
  const seen = new Set<string>();
  const visit = (n: string) => {
    if (seen.has(n)) return;
    seen.add(n);
    for (const d of order.find((o) => o.name === n)?.deps ?? []) visit(d);
    sorted.push(n);
  };
  order.forEach((o) => visit(o.name));

  const haloy = {
    name: slug(id),
    server: input.server ?? "localhost",
    targets,
  };
  files["haloy.yaml"] = toYaml(haloy, { lineWidth: 0 });
  files["deploy.sh"] =
    `#!/usr/bin/env bash\nset -euo pipefail\ncd "$(dirname "$0")"\nset -a; [ -f .env ] && . ./.env; set +a\n\n# Haloy has no depends_on: deploy in dependency order.\n` +
    sorted.map((n) => `haloy deploy -t ${n}`).join("\n") + "\n";
  const secretNames = Object.keys(secrets);
  const inputNames: string[] = [];
  if (needInput.size) warn("partial", "unset-vars", `${needInput.size} optional vars have no value in template.toml and were left empty/omitted: ${[...needInput].slice(0, 8).join(", ")}${needInput.size > 8 ? ", ..." : ""}`);
  files[".env.example"] = [...secretNames, ...inputNames].map((k) => `${k}=`).join("\n") + (secretNames.length + inputNames.length ? "\n" : "");
  files[".env"] = [...secretNames.map((k) => `${k}='${secrets[k].replace(/'/g, "'\\''")}'`), ...Object.entries(derived).map(([k, v]) => `${k}='${v.replace(/'/g, "'\\''")}'`)].join("\n") + (secretNames.length + Object.keys(derived).length ? "\n" : "");
  files[".gitignore"] = ".env\n";

  const status: Result["status"] = warnings.some((w) => w.level === "manual") ? "manual" : warnings.length ? "partial" : "ok";
  files["REPORT.md"] =
    `# ${id}\n\nStatus: **${status}**\n\n` +
    (warnings.length ? warnings.map((w) => `- [${w.level}] ${w.target ? `\`${w.target}\` ` : ""}${w.code}: ${w.message}`).join("\n") + "\n" : "No issues.\n");
  return { id, status, warnings, files, targets: sorted };
}
