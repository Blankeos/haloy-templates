# appwrite

Status: **manual**

- [partial] `appwrite` path-routing: Haloy routes by hostname only; /v1 on app.example.com became v1.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `appwrite` path-routing: Haloy routes by hostname only; /.well-known on app.example.com became well-known.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `appwrite` path-routing: Haloy routes by hostname only; /v1 on console.app.example.com became v1.console.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `appwrite-realtime` path-routing: Haloy routes by hostname only; /v1/realtime on app.example.com became v1-realtime.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `appwrite-realtime` path-routing: Haloy routes by hostname only; /v1/realtime on console.app.example.com became v1-realtime.console.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `appwrite-mqtt` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `appwrite-openruntimes-executor` docker-sock: mounts the Docker socket
- [partial] `appwrite-openruntimes-executor` host-path: host path /tmp mounted as-is; make sure it exists on the server
- [manual] `appwrite-orchestrator` docker-sock: mounts the Docker socket
- [partial] `appwrite` internal-ref-to-public: appwrite is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] unset-vars: 3 optional vars have no value in template.toml and were left empty/omitted: _APP_REALTIME_TAIL_RATE, _APP_MQTT_WS_PORT, _APP_QUEUE_NAME
