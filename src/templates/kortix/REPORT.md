# kortix

Status: **partial**

- [partial] `kortix-rest` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `kortix-kong` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `kortix-kong` internal-ref-to-public: kortix-kong is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] `kortix-api` internal-ref-to-public: kortix-api is reached by hostname from another service but has a domain; with rolling deploys its container name changes
