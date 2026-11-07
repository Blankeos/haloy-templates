# haloy-templates

Turn any [Dokploy template](https://github.com/Dokploy/templates) into a [Haloy](https://haloy.dev) config.

Haloy is a tiny CLI-driven deploy tool (about 25 MB on the server) with no UI, no templates marketplace and no compose support. This closes that gap: pick a template, get a `haloy.yaml`, run `deploy.sh`.

```sh
bun install
bun run translate rybbit --domain analytics.example.com --out ./out
cd out/rybbit && ./deploy.sh        # needs the haloy CLI + a configured server
```

Output per template:

| File | What |
|---|---|
| `haloy.yaml` | one Haloy target per compose service |
| `deploy.sh` | `haloy deploy -t <target>` in dependency order (Haloy has no `depends_on`) |
| `<target>/Dockerfile` | tiny Dockerfile for services that need a `command`/`entrypoint` or baked-in config files |
| `.env` | generated secrets (`${password:32}` etc). Never overwritten, gitignored |
| `REPORT.md` | what was translated, what needed a workaround, what needs a human |

## What it maps

| Compose / template.toml | Haloy |
|---|---|
| service | target (`<template>-<service>`; hostnames in env are rewritten to match) |
| `image` | `image` |
| postgres / mysql / redis / mongo / clickhouse... image | `preset: database` |
| service without a domain | `preset: service` |
| `command` / `entrypoint` | generated Dockerfile (Haloy has no such field) |
| bind-mounted template files | baked into that Dockerfile |
| named volumes, data-dir bind mounts | named volumes |
| `[[config.domains]]` | `domains`, `port` |
| path routing (`/api`) | a subdomain (`api.<host>`) + warning, Haloy routes by hostname only |
| `${password:N}`, `${base64:N}`, ... | generated into `.env`, read with `from: env` |
| `depends_on` | order in `deploy.sh` |
| HTTP healthcheck | `health_check_path` (command checks are dropped, with a warning) |
| Traefik labels, restart, networks | dropped |

Things Haloy cannot do are flagged `manual` in `REPORT.md`: Docker socket mounts, `privileged`, `cap_add`, devices, host networking, `build:` contexts, `env_file`.

## Coverage

```sh
bun run all --out ./out        # all ~600 templates + out/COVERAGE.md
scripts/validate-all.sh ./out  # runs `haloy validate-config` on each (needs the haloy CLI)
```

Current: 602 templates translated, 602 pass `haloy validate-config`. Roughly half need no manual work. See `COVERAGE.md` after a run.

Deploy-tested so far in a clean VM: Uptime Kuma, Ackee (with MongoDB), Rybbit and Chatwoot (hand-written equivalents).

## Notes

- Fetches only `docker-compose.yml`, `template.toml` per template from GitHub raw and caches them in `~/.cache/haloy-templates` (20 MB cap). It never clones the repo.
- Haloy does not interpolate `${VAR}` inside `value:` strings, so env values that embed a secret become a derived variable in `.env` read with `from: env`.
- Platform defaults to `linux/amd64`, matching Haloy.

## Skill

`skills/dokploy-to-haloy/SKILL.md` teaches a coding agent to add a template to a server: translate, review the report, deploy, verify.

MIT licensed.

## Credits

Templates come from [Dokploy/templates](https://github.com/Dokploy/templates) (Apache-2.0); the few fixtures under `test/fixtures` are copies of them.
