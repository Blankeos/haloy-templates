# 🪄 haloy-templates

Every [Dokploy template](https://github.com/Dokploy/templates) (602 of them), translated into a ready-to-deploy [Haloy](https://haloy.dev) config.

Haloy is tiny (~25 MB on the server) but has no UI, no one-click installs and no compose support. This is the missing catalog.

## 🚀 Use it

Deploy [Plausible](templates/plausible) to your Haloy server (swap `plausible` for any [template](templates)):

1. Point a DNS A record, e.g. `stats.example.com`, at your server.
2. Get the template (no clone needed):

   ```sh
   bunx github:Blankeos/haloy-templates add plausible --domain stats.example.com --server my-server
   ```

   `my-server` is the name from `haloy server add`. This creates `./plausible` with the config and a `.env` of generated secrets.
3. Deploy:

   ```sh
   cd plausible && cat REPORT.md && ./deploy.sh
   ```

You need [bun](https://bun.sh) for step 2 and the [haloy CLI](https://haloy.dev/docs/client-installation) for step 3. `list` shows everything bundled: `bunx github:Blankeos/haloy-templates list`.

## 📦 What you get

Each template lives in `templates/<id>/`:

| File | |
|---|---|
| `haloy.yaml` | one target per compose service |
| `deploy.sh` | targets in dependency order (Haloy has no `depends_on`) |
| `<target>/Dockerfile` | only where a `command`, `entrypoint` or config file had to be baked in |
| `vars.json` | secret recipes. `add` turns them into a `.env` and never overwrites one |
| `REPORT.md` | badges, what needed a workaround and what needs a human |

## 🔁 How it translates

| Dokploy | Haloy |
|---|---|
| service | target |
| postgres, redis, mongo... | `preset: database` |
| `command` / `entrypoint` / mounted config | tiny generated Dockerfile |
| `/api` path routing | generated nginx gateway target (Haloy routes by hostname only) |
| `${password:32}` and friends | generated into `.env`, read with `from: env` |
| `depends_on` | order in `deploy.sh` |
| Traefik labels | dropped |

Not translatable (flagged `manual`): `privileged`, devices, `cap_add`, host networking, `build:`, `env_file`.

## ✅ Status

Every template's `REPORT.md` carries its badges. A badge only counts while the template is unchanged since it was earned.

- ✅ **verified**: `haloy validate-config` passes.
- 🟢 **tested**: deployed on a real Haloy server, containers healthy, and the app answered requests.

<!-- status:start -->
| | |
|---|---|
| ✅ **verified** (`haloy validate-config` passes) | 601 / 602 |
| 🟢 **tested** (deployed, healthy, answers requests) | 4 / 602 |
| 🧩 **translation** | 387 clean, 168 with workarounds, 47 need a human |

| 🟢 Tested | What was checked | Arch | Date |
|---|---|---|---|
| [`chatwoot`](templates/chatwoot) | Production (netc, 2026-11-07): restored real data, login and conversations work. Rails boots slower than Haloy's health window, so the web target runs as a service behind the generated nginx gateway. | amd64 | 2026-11-07 |
| [`rustfs`](templates/rustfs) | S3 API on the domain: create bucket, put and get object; bad credentials rejected. Console (9001) not published | arm64 | 2026-11-07 |
| [`rybbit`](templates/rybbit) | all 6 targets up; /api and / both served on one host by the gateway; sign-up and session work; Postgres and ClickHouse connected | arm64 | 2026-11-07 |
| [`uptime-kuma`](templates/uptime-kuma) | container healthy; UI served through haloy-proxy; docker.sock mount present | arm64 | 2026-11-07 |
<!-- status:end -->

Translation details per warning are in [COVERAGE.md](COVERAGE.md).

## 🛠️ Maintain

```sh
bun run sync       # re-translate upstream into templates/
bun run validate   # haloy validate-config on all of them
bun test
```

A weekly workflow runs `sync` and opens a PR. See [AGENTS.md](AGENTS.md) for the routine.

## 🧩 Agent skill

[`skills/dokploy-to-haloy`](skills/dokploy-to-haloy/SKILL.md) teaches a coding agent to add, review, deploy and verify a template.

---

MIT. Templates are derived from [Dokploy/templates](https://github.com/Dokploy/templates) (Apache-2.0).
