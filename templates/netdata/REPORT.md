# netdata

Status: **manual**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [manual] `netdata` unsupported-cap_add: extra capabilities has no Haloy equivalent
- [partial] `netdata` host-path: host path /etc/passwd mounted as-is; make sure it exists on the server
- [partial] `netdata` host-path: host path /etc/group mounted as-is; make sure it exists on the server
- [partial] `netdata` host-path: host path /proc mounted as-is; make sure it exists on the server
- [partial] `netdata` host-path: host path /sys mounted as-is; make sure it exists on the server
- [partial] `netdata` host-path: host path /etc/os-release mounted as-is; make sure it exists on the server
- [partial] `netdata` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
