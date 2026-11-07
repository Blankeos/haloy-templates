# maintenant

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `maintenant` bind-mount: bind mount ../files/default.conf is a file with no matching content in template.toml; dropped
- [partial] `maintenant-app` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
- [partial] `maintenant-app` host-path: host path /proc mounted as-is; make sure it exists on the server
- [partial] `maintenant-app` host-path: host path /etc/os-release mounted as-is; make sure it exists on the server
