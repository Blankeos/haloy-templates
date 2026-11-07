# livekit

Status: **manual**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `livekit` extra-port: Haloy exposes one port per target; port 5349 (livekit-turn.app.example.com) is not published, only 7880 is. Reach it with `haloy tunnel` or a separate reverse proxy.
- [manual] `livekit-egress` unsupported-cap_add: extra capabilities has no Haloy equivalent
