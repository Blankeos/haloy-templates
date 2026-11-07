# wazuh

Status: **partial**

- [partial] `wazuh-manager` host-ports: published host ports (1514:1514, 1515:1515) are not exposed by Haloy; use `haloy tunnel` or add a domain
- [partial] `wazuh` internal-ref-to-public: wazuh is reached by hostname from another service but has a domain; with rolling deploys its container name changes
