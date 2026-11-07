# arche

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `arche-web` host-path: host path /opt/arche/kb-content mounted as-is; make sure it exists on the server
- [partial] `arche-web` host-path: host path /opt/arche/kb-config mounted as-is; make sure it exists on the server
- [partial] `arche-web` host-path: host path /opt/arche/users mounted as-is; make sure it exists on the server
- [partial] `arche-docker-socket-proxy` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
