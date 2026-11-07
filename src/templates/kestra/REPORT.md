# kestra

Status: **manual**

- [manual] `kestra` docker-sock: mounts the Docker socket
- [partial] `kestra` host-path: host path /tmp/kestra-wd mounted as-is; make sure it exists on the server
- [partial] `kestra` internal-ref-to-public: kestra is reached by hostname from another service but has a domain; with rolling deploys its container name changes
