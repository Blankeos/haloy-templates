# haloy-templates

Translates Dokploy templates (`docker-compose.yml` + `template.toml`) into Haloy configs (`haloy.yaml`).

- Bun + TypeScript. `bun test` for tests, `bun run src/cli.ts` for the CLI.
- All translation logic lives in `src/translate.ts` and is a pure function (`translate(input) -> files + warnings`). Keep it free of I/O.
- Never commit translated output or secrets. Output goes to `./out` (ignored).
- Every behaviour change needs a test in `test/translate.test.ts` using a fixture under `test/fixtures/<id>/`.
- Verify against the real thing: translate everything, then run `scripts/validate-all.sh <out dir>` on a machine with the `haloy` CLI. The target is 100% of templates passing `haloy validate-config`.
- Warnings are the honest part of this tool. If something cannot be translated, warn (`partial` = workaround applied, `manual` = needs a human) instead of guessing silently.
- Do not clone Dokploy/templates. Files are fetched one by one into `~/.cache/haloy-templates` (capped at 20 MB).
