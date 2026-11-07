# forgejo

Status: **partial**

- [partial] `forgejo` host-path: host path /etc/timezone mounted as-is; make sure it exists on the server
- [partial] `forgejo` host-path: host path /etc/localtime mounted as-is; make sure it exists on the server
- [partial] `forgejo` internal-ref-to-public: forgejo is reached by hostname from another service but has a domain; with rolling deploys its container name changes
