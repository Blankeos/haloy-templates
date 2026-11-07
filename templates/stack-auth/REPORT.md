# stack-auth

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `stack-auth` extra-port: Haloy exposes one port per target; port 8101 (app.example.com) is not published, only 8102 is. Reach it with `haloy tunnel` or a separate reverse proxy.
- [partial] unset-vars: 1 optional vars have no value in template.toml and were left empty/omitted: STACK_EMAIL_HOST
