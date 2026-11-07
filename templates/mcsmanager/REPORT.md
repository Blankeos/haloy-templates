# mcsmanager

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `mcsmanager-web` host-path: host path /etc/localtime mounted as-is; make sure it exists on the server
- [partial] `mcsmanager-daemon` host-path: host path /etc/localtime mounted as-is; make sure it exists on the server
- [partial] `mcsmanager-daemon` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
