# appwrite

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `appwrite-mqtt` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `appwrite-openruntimes-executor` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
- [partial] `appwrite-openruntimes-executor` host-path: host path /tmp mounted as-is; make sure it exists on the server
- [partial] `appwrite-orchestrator` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
- [partial] `appwrite-gateway` path-routing: Haloy routes by hostname only, so app.example.com (/, /v1, /.well-known, /v1/realtime) is served by a generated nginx target `appwrite-gateway` that proxies each path to its service.
- [partial] `appwrite-gateway` path-routing: Haloy routes by hostname only, so console.app.example.com (/, /v1, /v1/realtime) is served by a generated nginx target `appwrite-gateway` that proxies each path to its service.
- [partial] `appwrite` internal-ref-to-public: appwrite is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] unset-vars: 3 optional vars have no value in template.toml and were left empty/omitted: _APP_REALTIME_TAIL_RATE, _APP_MQTT_WS_PORT, _APP_QUEUE_NAME
