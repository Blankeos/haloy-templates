# 🪄 haloy-templates

Every [Dokploy template](https://github.com/Dokploy/templates) (602 of them), translated into a ready-to-deploy [Haloy](https://haloy.dev) config.

Haloy is tiny (~25 MB on the server) but has no UI, no one-click installs and no compose support. This is the missing catalog.

## 🚀 Use it

```sh
bun install
bun run list                                  # what's bundled
bun run add plausible --domain stats.example.com --server my-server --out ./apps
cd apps/plausible && cat REPORT.md && ./deploy.sh
```

You need the [haloy CLI](https://haloy.dev/docs/client-installation) and a server running `haloyd`.

## 📦 What you get

Each template lives in `src/templates/<id>/`:

| File | |
|---|---|
| `haloy.yaml` | one target per compose service |
| `deploy.sh` | targets in dependency order (Haloy has no `depends_on`) |
| `<target>/Dockerfile` | only where a `command`, `entrypoint` or config file had to be baked in |
| `vars.json` | secret recipes. `add` turns them into a `.env` and never overwrites one |
| `REPORT.md` | what needed a workaround and what needs a human |

## 🔁 How it translates

| Dokploy | Haloy |
|---|---|
| service | target |
| postgres, redis, mongo... | `preset: database` |
| `command` / `entrypoint` / mounted config | tiny generated Dockerfile |
| `/api` path routing | subdomain (`api.host`), Haloy routes by hostname only |
| `${password:32}` and friends | generated into `.env`, read with `from: env` |
| `depends_on` | order in `deploy.sh` |
| Traefik labels | dropped |

Not translatable (flagged `manual`): Docker socket, `privileged`, devices, `cap_add`, host networking, `build:`, `env_file`.

## ✅ Status

- All 602 templates pass `haloy validate-config` (CI checks this).
- 316 clean, 215 with workarounds, 71 need a human. Details in [COVERAGE.md](COVERAGE.md).
- Validated is not the same as deployed. Deploy-tested so far: Uptime Kuma, Ackee + MongoDB.

## 🛠️ Maintain

```sh
bun run sync       # re-translate upstream into src/templates
bun run validate   # haloy validate-config on all of them
bun test
```

A weekly workflow runs `sync` and opens a PR. See [AGENTS.md](AGENTS.md) for the routine.

## 🧩 Agent skill

[`skills/dokploy-to-haloy`](skills/dokploy-to-haloy/SKILL.md) teaches a coding agent to add, review, deploy and verify a template.

---

MIT. Templates are derived from [Dokploy/templates](https://github.com/Dokploy/templates) (Apache-2.0).
