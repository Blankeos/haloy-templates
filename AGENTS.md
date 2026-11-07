# haloy-templates

Dokploy templates translated into Haloy configs, bundled in `templates/<id>/`.

## Layout

- `src/translate.ts`: pure function `translate(input) -> files + warnings`. No I/O, deterministic.
- `src/cli.ts`: `list`, `add`, `env`, `translate`, `sync`. `src/fetch.ts`: upstream fetch + capped cache. `src/secrets.ts`: `.env` generation.
- `templates/`: generated. Never hand-edit; change the translator and re-sync. `index.json`, `UPSTREAM` (upstream commit) and `/COVERAGE.md` are generated too.
- Secrets never live in the repo. Each template has a `vars.json` recipe; `add` generates `.env`.

## Rules

- Bun + TypeScript. `bun test`, `bunx tsc --noEmit`.
- Every translator behaviour change needs a test using a fixture in `test/fixtures/<id>/`.
- Warn instead of guessing: `partial` = workaround applied, `manual` = needs a human.
- Do not clone Dokploy/templates. Files are fetched one by one into `~/.cache/haloy-templates` (20 MB cap).
- Do not leave junk behind: temp output and VMs get deleted after use.

## Maintaining (routine)

1. `bun run sync`. A weekly workflow does this and opens a PR; the diff is the upstream change.
2. `bun run validate` (needs the haloy CLI). The bar is 602/602 (all templates) passing `haloy validate-config`. A failure means a translator bug: fix `translate.ts`, add a fixture test, re-sync.
3. Read the `COVERAGE.md` diff. New warning codes or fewer clean templates need a look.
4. Deploy-test a sample of new or changed templates in a throwaway amd64 VM (health check passing, not just validating) before calling them working. Haloy does not expand `${VAR}` in `value:`; use `from: env`.
5. Never claim a template works unless it was deployed and healthy.
