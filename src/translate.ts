import { parse as parseYaml, stringify as toYaml } from "yaml";
import { parse as parseToml } from "smol-toml";

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

/** POSIX word splitting, the way Compose parses a string `command:` / `entrypoint:` (no shell is involved). */
export function shlex(input: string): string[] {
  const out: string[] = [];
  let cur = "";
  let has = false;
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (/\s/.test(c)) { if (has) { out.push(cur); cur = ""; has = false; } i++; continue; }
    has = true;
    if (c === "'") {
      const j = input.indexOf("'", i + 1);
      const end = j < 0 ? input.length : j;
      cur += input.slice(i + 1, end);
      i = end + 1;
    } else if (c === '"') {
      i++;
      while (i < input.length && input[i] !== '"') {
        if (input[i] === "\\" && /["\\$`\n]/.test(input[i + 1] ?? "")) { if (input[i + 1] !== "\n") cur += input[i + 1]; i += 2; }
        else cur += input[i++];
      }
      i++;
    } else if (c === "\\") {
      if (input[i + 1] !== "\n") cur += input[i + 1] ?? "";
      i += 2;
    } else { cur += c; i++; }
  }
  if (has) out.push(cur);
  return out;
}

/** Services that publish several ports: which one gets the public domain. */
/** Images whose "/" is not a 2xx (S3 servers answer 403), so Haloy's default health check would fail. */
const HEALTH_PATH: Record<string, string> = { rustfs: "/health", minio: "/minio/health/live" };
const PREFERRED_PORT: Record<string, string> = { rustfs: "9000" };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const upper = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^(\d)/, "T_$1");
const imageName = (image: string) => image.split("/").pop()!.split(":")[0].split("@")[0];

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
  const secrets: Record<string, string> = {}; // ENV_NAME -> generator spec, e.g. "password:32"
  const needInput = new Set<string>(); // vars the user must supply
  const derived: Record<string, string> = {}; // composed env strings that embed secrets
  const secretVars = new Set<string>(); // template variable names that are secrets
  const plain: Record<string, string> = {};
  const rawVars: Record<string, string> = { ...(tpl.variables ?? {}) };
  for (const [k, v] of Object.entries(rawVars)) {
    const s = String(v);
    if (HELPER.test(s)) {
      if (/^\$\{randomPort\}$/.test(s)) plain[k] = "8080";
      else {
        secretVars.add(k);
        secrets[upper(k)] = s.slice(2, -1);
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
        secrets[key] ??= name;
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

  const normHost = (h: string) => { const x = h.replace(/_/g, "-"); return x.includes(".") ? x : `${x}.${domain}`; };
  const allHosts = new Set(Object.values(domainsBySvc).flat().map((d) => normHost(d.host)));
  /** Hosts where Dokploy routes by path: Haloy cannot, so a generated nginx gateway fronts them. */
  const gwHosts = new Map<string, { svc: string; port?: string; path: string }[]>();
  for (const [svc, ds] of Object.entries(domainsBySvc)) for (const d of ds) if (d.path && d.path !== "/") gwHosts.set(normHost(d.host), []);
  for (const [svc, ds] of Object.entries(domainsBySvc)) for (const d of ds) gwHosts.get(normHost(d.host))?.push({ svc, port: d.port, path: d.path || "/" });

  /** Images that boot slower than Haloy's health-check window (~20s): front them with the gateway so the app target runs as a plain service. */
  const SLOW_START = new Set(["chatwoot/chatwoot"]);
  for (const [svc, ds] of Object.entries(domainsBySvc)) {
    const img = String((services as any)[svc]?.image ?? "");
    if (!SLOW_START.has(img.split(":")[0])) continue;
    for (const d of ds) { const h = normHost(d.host); if (!gwHosts.has(h)) gwHosts.set(h, [{ svc, port: d.port, path: "/" }]); }
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
    const toArr = (v: any) => (v == null ? undefined : Array.isArray(v) ? v.map(String) : shlex(String(v)));
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
      let value = resolve(v, t, k);
      // Haloy serves every domain over TLS, so public URLs that point at one must be https.
      for (const h of allHosts) value = value.replaceAll(`http://${h}`, `https://${h}`);
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
        if (src.includes("docker.sock")) warn("partial", "docker-sock", "mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)", t);
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
    // Haloy exposes ONE port per target. If a template routes several ports of a service,
    // keep the API-ish one (PREFERRED_PORT) or the first, and report the rest.
    const portsHere = [...new Set(doms.map((d) => d.port).filter(Boolean))] as string[];
    let port: string | undefined = (PREFERRED_PORT[base] && portsHere.includes(PREFERRED_PORT[base])) ? PREFERRED_PORT[base] : portsHere[0];
    for (const d of doms) {
      let host = normHost(d.host);
      if (gwHosts.has(host)) continue; // served by the gateway target
      if (d.port && port && d.port !== port) {
        warn("partial", "extra-port", `Haloy exposes one port per target; port ${d.port} (${d.host}) is not published, only ${port} is. Reach it with \`haloy tunnel\` or a separate reverse proxy.`, t);
        continue;
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
      if (!port) {
        port = "8080";
        if (domainEntries.length) warn("partial", "guessed-port", "could not determine the container port; defaulted to 8080", t);
        // Haloy refuses a port the image does not EXPOSE; declare the placeholder one so workers/cron services start.
        needsDockerfile = true;
        df.push(`EXPOSE ${port}`);
      }
    }
    const hc = def.healthcheck?.test;
    if (hc) {
      const text = Array.isArray(hc) ? hc.join(" ") : String(hc);
      const m = text.match(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(\/[^\s"'\]]*)?/);
      if (m) out.health_check_path = m[1] ?? "/";
      else if (!DB_IMAGES.has(base)) warn("partial", "healthcheck", "command-style healthcheck dropped (Haloy supports HTTP path checks only)", t);
    }

    if (!out.health_check_path && HEALTH_PATH[base] && !DB_IMAGES.has(base)) out.health_check_path = HEALTH_PATH[base];
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
      const hasVar = (a?: string[]) => !!a?.some((x) => /\$\{[A-Z0-9_]+\}/.test(x));
      if (entry && cmd && alreadyShell(entry)) {
        // `sh -c` entrypoint: the command is its script, and the shell expands env at runtime.
        [...entry, ...cmd].forEach(addEnv);
        df.push(`ENTRYPOINT ${JSON.stringify(entry)}`, `CMD ${JSON.stringify(cmd)}`);
      } else if (entry && cmd && (hasVar(entry) || hasVar(cmd))) {
        // Entrypoint and command are one argv; expand env once around the whole of it.
        df.push(`ENTRYPOINT ${JSON.stringify(shellForm([...entry, ...cmd]))}`, "CMD []");
      } else {
        const entryF = entry && shellForm(entry);
        const cmdF = cmd && shellForm(cmd);
        if (entryF) df.push(`ENTRYPOINT ${JSON.stringify(entryF)}`);
        if (cmdF) df.push(`CMD ${JSON.stringify(cmdF)}`);
        if (cmdF && !entry && hasVar(cmd) && !alreadyShell(cmd!) && !DB_IMAGES.has(base)) {
          warn("partial", "entrypoint-wrapped", "command needs env expansion, so it runs via `sh -c`; if the image's own ENTRYPOINT matters, check it still starts correctly", t);
        }
      }
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
          const composed = e.value;
          const refs = [...composed.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)].map((m) => m[1]);
          if (refs.every((n) => n in secrets || n in derived)) {
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

  // ---- gateway for path routing -------------------------------------------
  if (gwHosts.size) {
    const g = `${slug(id)}-gateway`;
    const q = (x: string) => x.replace(/[^\w./-]/g, "");
    let conf = "map $http_upgrade $connection_upgrade { default upgrade; '' close; }\nresolver 127.0.0.11 valid=10s;\n\n";
    let first = true;
    for (const [host, routes] of gwHosts) {
      conf += `server {\n  listen 80${first ? " default_server" : ""};\n  server_name ${host};\n  client_max_body_size 0;\n  location = /_gateway_health { return 200 "ok"; }\n`;
      first = false;
      for (const r of [...routes].sort((a, b) => b.path.length - a.path.length)) {
        const to = names[r.svc] ?? r.svc;
        const prt = r.port ?? targets[to]?.port ?? "80";
        conf += `  location ${q(r.path)} {\n    set $up http://${to}:${prt};\n    proxy_pass $up;\n    proxy_http_version 1.1;\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    proxy_set_header X-Forwarded-Proto https;\n    proxy_set_header Upgrade $http_upgrade;\n    proxy_set_header Connection $connection_upgrade;\n    proxy_read_timeout 3600s;\n  }\n`;
      }
      conf += "}\n";
      warn("partial", "path-routing", `Haloy routes by hostname only, so ${host} (${routes.map((r) => r.path).join(", ")}) is served by a generated nginx target \`${g}\` that proxies each path to its service.`, g);
    }
    files[`${g}/default.conf`] = conf;
    files[`${g}/Dockerfile`] = "FROM nginx:alpine\nCOPY default.conf /etc/nginx/conf.d/default.conf\n";
    targets[g] = {
      image: { repository: g, tag: "latest", build_config: { context: `./${g}`, push: "server" } },
      port: "80",
      health_check_path: "/_gateway_health",
      domains: [...gwHosts.keys()].map((domain) => ({ domain })),
    };
    order.push({ name: g, deps: [...new Set([...gwHosts.values()].flat().map((r) => names[r.svc]).filter(Boolean))] });
  }

  // services referenced by others by hostname must be domainless (static name)
  for (const [svc, def] of Object.entries<any>(services)) {
    const t = names[svc];
    if (!targets[t].domains) continue;
    const referenced = Object.values<any>(targets).some((o: any) => o !== targets[t] && (o.env ?? []).some((e: any) => new RegExp(`(@|://)${t}(?=[:/?]|$)|(?<![\\w-])${t}:\\d`).test(String(e.value))));
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
  if (needInput.size) warn("partial", "unset-vars", `${needInput.size} optional vars have no value in template.toml and were left empty/omitted: ${[...needInput].slice(0, 8).join(", ")}${needInput.size > 8 ? ", ..." : ""}`);
  if (Object.keys(secrets).length || Object.keys(derived).length) {
    files["vars.json"] = JSON.stringify({ secrets, derived }, null, 2) + "\n";
  }

  const status: Result["status"] = warnings.some((w) => w.level === "manual") ? "manual" : warnings.length ? "partial" : "ok";
  files["REPORT.md"] =
    `# ${id}\n\nStatus: **${status}**\n\n` +
    (warnings.length ? warnings.map((w) => `- [${w.level}] ${w.target ? `\`${w.target}\` ` : ""}${w.code}: ${w.message}`).join("\n") + "\n" : "No issues.\n");
  return { id, status, warnings, files, targets: sorted };
}
