# falco

Status: **manual**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [manual] `falco` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [partial] `falco` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
- [partial] `falco` host-path: host path /proc mounted as-is; make sure it exists on the server
- [partial] `falco` host-path: host path /etc mounted as-is; make sure it exists on the server
- [partial] `falco` host-path: host path /sys/kernel/tracing mounted as-is; make sure it exists on the server
- [partial] `falco-redis` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `falco-redis` entrypoint-wrapped: command needs env expansion, so it runs via `sh -c`; if the image's own ENTRYPOINT matters, check it still starts correctly
- [partial] `falco-ui` internal-ref-to-public: falco-ui is reached by hostname from another service but has a domain; with rolling deploys its container name changes
