# metabase

Status: **partial**

- [partial] `metabase` host-path: host path /dev/urandom mounted as-is; make sure it exists on the server
- [partial] `metabase` internal-ref-to-public: metabase is reached by hostname from another service but has a domain; with rolling deploys its container name changes
