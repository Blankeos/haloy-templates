# inngest

Status: **manual**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `inngest` entrypoint-wrapped: command needs env expansion, so it runs via `sh -c`; if the image's own ENTRYPOINT matters, check it still starts correctly
- [manual] `inngest-redis` unsupported-sysctls: sysctls has no Haloy equivalent
