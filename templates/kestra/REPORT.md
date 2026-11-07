# kestra

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `kestra` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
- [partial] `kestra` host-path: host path /tmp/kestra-wd mounted as-is; make sure it exists on the server
