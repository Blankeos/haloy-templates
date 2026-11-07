# plunk

Status: **partial**

- [partial] `plunk` host-path: host path /etc/dokploy/traefik/dynamic/acme.json mounted as-is; make sure it exists on the server
- [partial] `plunk-minio` internal-ref-to-public: plunk-minio is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] `plunk` internal-ref-to-public: plunk is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] unset-vars: 1 optional vars have no value in template.toml and were left empty/omitted: SES_CONFIGURATION_SET_NO_TRACKING
