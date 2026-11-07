# chroma

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `chroma-gateway` path-routing: Haloy routes by hostname only, so app.example.com (/api/v2/heartbeat) is served by a generated nginx target `chroma-gateway` that proxies each path to its service.
