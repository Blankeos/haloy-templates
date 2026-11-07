# powersync

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `powersync-gateway` path-routing: Haloy routes by hostname only, so app.example.com (/probes/liveness) is served by a generated nginx target `powersync-gateway` that proxies each path to its service.
