---
name: dokploy-to-haloy
description: Add a self-hosted app to a Haloy server by translating its Dokploy template. Use when asked to install, deploy or migrate an open-source app (Plausible, Rybbit, Chatwoot, Uptime Kuma...) onto a Haloy server, or to convert a Dokploy template/docker-compose stack to haloy.yaml.
---

# Dokploy template to Haloy

Haloy has no template marketplace. `haloy-templates` translates Dokploy's templates into `haloy.yaml`.

1. Find the template id (folder name in https://github.com/Dokploy/templates/tree/canary/blueprints).
2. Translate: `bun run src/cli.ts translate <id> --domain <host> --server <haloy server> --out <registry>/apps`
3. Read `REPORT.md`. `partial` entries are workarounds already applied (check them). `manual` entries need a human decision: Docker socket mounts, privileged, devices, `build:`, `env_file`.
4. Path routing (`/api` on the main host) becomes a subdomain. Point DNS at it and fix any URL env vars it names.
5. Fill optional vars the report lists as unset only if the app needs them. `.env` already holds generated secrets; never commit it.
6. Validate: `haloy validate-config` in the app folder (source `.env` first).
7. Deploy with `./deploy.sh` (dependency order is baked in). Haloy has no `depends_on`: if a database is slow to start, rerun the app target.
8. Verify: `haloy status`, hit the health path, check logs with `haloy logs -t <target>`. Test on a throwaway machine first for anything stateful.

Do not claim a template works until it has actually been deployed and its health check passed.
