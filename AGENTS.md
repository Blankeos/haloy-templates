# haloy-templates

Dokploy templates translated into Haloy configs, bundled in `templates/<id>/`.

## Layout

- `src/translate.ts`: pure function `translate(input) -> files + warnings`. No I/O, deterministic.
- `src/cli.ts`: `list`, `add`, `env`, `translate`, `sync`, `record`, `badges`. `src/status.ts`: badge logic. `src/fetch.ts`: upstream fetch + capped cache. `src/secrets.ts`: `.env` generation.
- `templates/`: generated. Never hand-edit; change the translator and re-sync. `index.json`, `UPSTREAM` (upstream commit) and `/COVERAGE.md` are generated too.
- `status.json`: the only hand-recorded evidence (who passed validation, who was deployed). Written by `record`, never edited by hand. Each entry stores a hash of the template; if the template changes, the badge disappears until it is earned again.
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
4. Badges (shown in each `REPORT.md` and in the README summary):
   - ✅ verified: `bun run validate` passes `haloy validate-config`; it records the result itself.
   - 🟢 tested: deploy the template on a real Haloy server, wait for healthy, and exercise the app (log in, call its API, write and read data). Then `bun src/cli.ts record tested <id> --haloy <version> --arch <arch> --notes "<what you actually checked>"`. A health check alone is not enough, and the notes must be true. `add --platform linux/arm64` is allowed on an arm64 test box; say so in the notes.
5. Haloy does not expand `${VAR}` in `value:`; use `from: env`.
6. Never claim a template works unless it carries 🟢 tested.
