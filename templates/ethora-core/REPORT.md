# ethora-core

Status: **manual**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [manual] `ethora-core-config` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `ethora-core-xmpp` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `ethora-core-gateway` path-routing: Haloy routes by hostname only, so app.app.example.com (/, /connection/websocket) is served by a generated nginx target `ethora-core-gateway` that proxies each path to its service.
- [partial] `ethora-core-gateway` path-routing: Haloy routes by hostname only, so xmpp.app.example.com (/ws, /bosh) is served by a generated nginx target `ethora-core-gateway` that proxies each path to its service.
