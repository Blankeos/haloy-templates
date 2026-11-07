# peerdb

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `peerdb-temporal-admin-tools` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `peerdb-minio` internal-ref-to-public: peerdb-minio is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] unset-vars: 2 optional vars have no value in template.toml and were left empty/omitted: TEMPORAL_CLIENT_CERT, TEMPORAL_CLIENT_KEY
