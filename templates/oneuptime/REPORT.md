# oneuptime

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `oneuptime-clickhouse` bind-mount: bind mount ../files/clickhouse/cluster.xml is a file with no matching content in template.toml; dropped
- [partial] `oneuptime-clickhouse` bind-mount: bind mount ../files/clickhouse/distributed-insert-tuning.xml is a file with no matching content in template.toml; dropped
- [partial] `oneuptime-ingress` internal-ref-to-public: oneuptime-ingress is reached by hostname from another service but has a domain; with rolling deploys its container name changes
