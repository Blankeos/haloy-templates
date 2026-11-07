# zitadel

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `zitadel` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `zitadel` entrypoint-wrapped: command needs env expansion, so it runs via `sh -c`; if the image's own ENTRYPOINT matters, check it still starts correctly
