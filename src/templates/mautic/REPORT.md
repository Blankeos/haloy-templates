# mautic

Status: **partial**

- [partial] `mautic` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `mautic-worker` resources: resource limits dropped (Haloy has no limit fields)
- [partial] `mautic` internal-ref-to-public: mautic is reached by hostname from another service but has a domain; with rolling deploys its container name changes
