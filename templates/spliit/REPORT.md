# spliit

Status: **manual**

- [manual] `spliit` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [manual] `spliit-db` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `spliit-db` host-path: host path /data/spliit/database mounted as-is; make sure it exists on the server
- [partial] `spliit` internal-ref-to-public: spliit is reached by hostname from another service but has a domain; with rolling deploys its container name changes
