import { describe, expect, test } from "bun:test";
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

test("path routing is served by a generated nginx gateway on one host", () => {
  const r = translate(load("rybbit"));
  const y = yaml(r);
  expect(r.warnings.some((w) => w.code === "path-routing")).toBe(true);
  expect(y.targets["rybbit-backend"].domains).toBeUndefined();
  expect(y.targets["rybbit-gateway"].domains).toEqual([{ domain: "app.example.com" }]);
  expect(r.files["rybbit-gateway/default.conf"]).toContain("location /api");
  expect(r.targets.at(-1)).toBe("rybbit-gateway");
  const base = y.targets["rybbit-backend"].env.find((e: any) => e.name === "BASE_URL");
  expect(base.value).toBe("https://app.example.com");
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
  expect(r.targets.length).toBe(5);
});

import { shlex } from "../src/translate";

describe("commands", () => {
  test("shlex splits like Compose, with no shell", () => {
    expect(shlex(`server /data --console-address ":9001"`)).toEqual(["server", "/data", "--console-address", ":9001"]);
    expect(shlex(`a 'b c'  "d \\"e\\""`)).toEqual(["a", "b c", 'd "e"']);
  });
  test("string command is passed as arguments, not wrapped in sh -c", () => {
    const r = translate({ id: "x", compose: `services:\n  app:\n    image: foo/bar\n    command: /data --x\n` });
    expect(r.files["x-app/Dockerfile"]).toContain('CMD ["/data","--x"]');
  });
  test("sh -c entrypoint keeps its script as the command", () => {
    const r = translate({ id: "x", compose: `services:\n  app:\n    image: foo/bar\n    entrypoint: ["sh","-c"]\n    command: ["echo $$HOME && run"]\n` });
    expect(r.files["x-app/Dockerfile"]).toContain('ENTRYPOINT ["sh","-c"]');
    expect(r.files["x-app/Dockerfile"]).not.toContain("exec \"");
  });
  test("docker.sock is a partial, not manual", () => {
    const r = translate({ id: "x", compose: `services:\n  app:\n    image: foo/bar\n    volumes:\n      - /var/run/docker.sock:/var/run/docker.sock\n` });
    expect(r.status).toBe("partial");
  });
  test("several routed ports: one is published and the rest reported", () => {
    const r = translate({
      id: "x",
      compose: `services:\n  app:\n    image: foo/bar\n`,
      templateToml: `[[config.domains]]\nserviceName="app"\nport=1\nhost="a.x.com"\n[[config.domains]]\nserviceName="app"\nport=2\nhost="b.x.com"\n`,
    });
    expect(r.warnings.some((w) => w.code === "extra-port")).toBe(true);
  });
});
