# harbor

Status: **manual**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [manual] `harbor-init` build: service uses `build:`; template must be built from its own source and pushed to a registry first
- [manual] `harbor-init` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-core` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-postgresql` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [partial] `harbor-postgresql` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `harbor-redis` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-registry` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-registryctl` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-jobservice` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-portal` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-proxy` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-trivy-adapter` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `harbor-exporter` unsupported-cap_add: extra capabilities has no Haloy equivalent
