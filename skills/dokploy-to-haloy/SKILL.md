---
name: dokploy-to-haloy
description: Add a self-hosted app to a Haloy server by translating its Dokploy template. Use when asked to install, deploy or migrate an open-source app (Plausible, Rybbit, Chatwoot, Uptime Kuma...) onto a Haloy server, or to convert a Dokploy template/docker-compose stack to haloy.yaml.
---

# Dokploy template to Haloy

Haloy has no template marketplace. `haloy-templates` bundles Dokploy's templates, translated into `haloy.yaml`.

1. Find the template id (folder name in https://github.com/Dokploy/templates/tree/canary/blueprints).
2. Add the bundled template: `bun run add <id> --domain <host> --server <haloy server> --out <registry>/apps` (all Dokploy templates are pre-translated in `templates/`; `bun run list` shows them). If it is missing, run `bun run sync --only <id>`.
3. Read `REPORT.md`, starting with its badges: ✅ verified means `haloy validate-config` passes, 🟢 tested means someone deployed it and used it. No 🟢 means it is unproven: expect to debug it. `partial` entries are workarounds already applied (check them). `manual` entries need a human decision: privileged, devices, `build:`, `env_file`.
4. Path routing (`/api` on the main host) is served by a generated `<id>-gateway` nginx target, so only the main host needs DNS. Haloy exposes one port per target: any extra published port is listed in the report.
5. Optional vars the report lists as unset are omitted; add them to `haloy.yaml` only if the app needs them. `.env` already holds generated secrets; never commit it.
6. Validate: `haloy validate-config` in the app folder (source `.env` first).
7. Deploy with `./deploy.sh` (dependency order is baked in). Haloy has no `depends_on`: if a database is slow to start, rerun the app target.
8. Verify: `haloy status`, hit the health path, check logs with `haloy logs -t <target>`. Test on a throwaway machine first for anything stateful.

Do not claim a template works until it has actually been deployed and its health check passed.

## Earning the 🟢 tested badge

After you deploy a template and confirm the app really works (not just a green health check: log in, call the API, write and read data), record it so the next person gets the badge:

```sh
bun src/cli.ts record tested <id> --haloy <haloy version> --arch <arch> --notes "<what you checked>"
```

The notes must be true. The badge disappears on its own if the template changes later.
