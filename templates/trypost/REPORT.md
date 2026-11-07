# trypost

Status: **manual**

- [manual] `trypost` build: service uses `build:`; template must be built from its own source and pushed to a registry first
- [manual] `trypost` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `trypost` internal-ref-to-public: trypost is reached by hostname from another service but has a domain; with rolling deploys its container name changes
