# reactive-resume

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `reactive-resume-gateway` path-routing: Haloy routes by hostname only, so app.example.com (/, /default) is served by a generated nginx target `reactive-resume-gateway` that proxies each path to its service.
