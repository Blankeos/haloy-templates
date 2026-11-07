# autobase

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `autobase-console` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
- [partial] `autobase-console` host-path: host path /tmp/ansible mounted as-is; make sure it exists on the server
- [partial] `autobase-console` extra-port: Haloy exposes one port per target; port 8080 (app.example.com) is not published, only 80 is. Reach it with `haloy tunnel` or a separate reverse proxy.
