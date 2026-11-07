# sim

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `sim-gateway` path-routing: Haloy routes by hostname only, so app.example.com (/, /socket.io) is served by a generated nginx target `sim-gateway` that proxies each path to its service.
