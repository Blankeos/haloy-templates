# maintenant

Status: **manual**

- [partial] `maintenant` bind-mount: bind mount ../files/default.conf is a file with no matching content in template.toml; dropped
- [manual] `maintenant-app` docker-sock: mounts the Docker socket
- [partial] `maintenant-app` host-path: host path /proc mounted as-is; make sure it exists on the server
- [partial] `maintenant-app` host-path: host path /etc/os-release mounted as-is; make sure it exists on the server
- [partial] `maintenant` internal-ref-to-public: maintenant is reached by hostname from another service but has a domain; with rolling deploys its container name changes
