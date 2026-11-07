# uptime-kuma

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)
Badge: 🟢 tested (arm64, haloy v0.1.0-beta.73, 2026-11-07): container healthy; UI served through haloy-proxy; docker.sock mount present

- [partial] `uptime-kuma` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
