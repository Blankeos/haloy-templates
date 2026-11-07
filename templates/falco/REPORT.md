# falco

Status: **manual**

- [manual] `falco` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [manual] `falco` docker-sock: mounts the Docker socket
- [partial] `falco` host-path: host path /proc mounted as-is; make sure it exists on the server
- [partial] `falco` host-path: host path /etc mounted as-is; make sure it exists on the server
- [partial] `falco` host-path: host path /sys/kernel/tracing mounted as-is; make sure it exists on the server
- [partial] `falco-redis` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `falco-ui` internal-ref-to-public: falco-ui is reached by hostname from another service but has a domain; with rolling deploys its container name changes
