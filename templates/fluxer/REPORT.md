# fluxer

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `fluxer-livekit` host-ports: published host ports (7881, 7882/udp) are not exposed by Haloy; use `haloy tunnel` or add a domain
- [partial] `fluxer-caddy` internal-ref-to-public: fluxer-caddy is reached by hostname from another service but has a domain; with rolling deploys its container name changes
