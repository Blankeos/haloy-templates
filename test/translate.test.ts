import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { buildEnv } from "../src/secrets";
import { translate } from "../src/translate";

const load = (id: string) => ({
  id,
  compose: readFileSync(`test/fixtures/${id}/docker-compose.yml`, "utf8"),
  templateToml: readFileSync(`test/fixtures/${id}/template.toml`, "utf8"),
  domain: "app.example.com",
});
const yaml = (r: ReturnType<typeof translate>) => parse(r.files["haloy.yaml"]);

test("single container template: domain and port mapped, docker socket flagged", () => {
  const r = translate(load("uptime-kuma"));
  expect(r.warnings.map((w) => w.code)).toContain("docker-sock");
  const y = yaml(r);
  expect(y.targets["uptime-kuma"].domains).toEqual([{ domain: "app.example.com" }]);
  expect(y.targets["uptime-kuma"].port).toBe("3001");
});

test("path routing becomes a subdomain with a warning", () => {
  const r = translate(load("rybbit"));
  expect(r.warnings.some((w) => w.code === "path-routing")).toBe(true);
  expect(yaml(r).targets["rybbit-backend"].domains).toEqual([{ domain: "api.app.example.com" }]);
});

test("databases get the database preset and deploy first", () => {
  const r = translate(load("rybbit"));
  const y = yaml(r);
  expect(y.targets["rybbit-postgres"].preset).toBe("database");
  expect(r.targets.indexOf("rybbit-postgres")).toBeLessThan(r.targets.indexOf("rybbit-backend"));
});

test("bind-mounted template files and custom commands are baked into a Dockerfile", () => {
  const r = translate(load("rybbit"));
  expect(r.files["rybbit-clickhouse/Dockerfile"]).toContain("COPY clickhouse_config /etc/clickhouse-server/config.d");
  expect(r.files["rybbit-clickhouse/clickhouse_config/network.xml"]).toContain("listen_host");
  expect(r.files["rybbit-redis/Dockerfile"]).toMatch(/CMD \["sh","-c","exec redis-server/);
});

test("service names used as hostnames are rewritten to target names", () => {
  const env = yaml(translate(load("rybbit"))).targets["rybbit-backend"].env;
  expect(env.find((e: any) => e.name === "POSTGRES_HOST").value).toBe("rybbit-postgres");
  expect(env.find((e: any) => e.name === "CLICKHOUSE_HOST").value).toBe("http://rybbit-clickhouse:8123");
});

test("secrets are never in the output; vars.json holds recipes and derived strings", () => {
  const r = translate(load("ackee"));
  const vars = JSON.parse(r.files["vars.json"]);
  expect(vars.secrets.MONGO_INITDB_ROOT_PASSWORD).toMatch(/^password:\d+$/);
  expect(vars.derived.ACKEE__ACKEE_MONGODB).toBe("mongodb://mongo:${MONGO_INITDB_ROOT_PASSWORD}@ackee-mongo:27017");
  expect(yaml(r).targets.ackee.env.find((e: any) => e.name === "ACKEE_MONGODB").from.env).toBe("ACKEE__ACKEE_MONGODB");
  expect(r.files[".env"]).toBeUndefined();
});

test("buildEnv generates secrets and fills derived strings", () => {
  const env = buildEnv({ secrets: { PW: "password:8" }, derived: { URL: "db://u:${PW}@h" } }, () => "abc");
  expect(env).toContain("PW='abc'");
  expect(env).toContain("URL='db://u:abc@h'");
});

test("output is deterministic", () => {
  expect(translate(load("rybbit")).files).toEqual(translate(load("rybbit")).files);
});

test("multi-service chatwoot template: command survives in a Dockerfile", () => {
  const r = translate(load("chatwoot"));
  expect(Object.keys(r.files).filter((f) => f.endsWith("/Dockerfile")).length).toBeGreaterThanOrEqual(1);
  expect(r.targets.length).toBe(4);
});
