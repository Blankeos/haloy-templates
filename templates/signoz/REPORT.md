# signoz

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `signoz-clickhouse` bind-mount: bind mount ../files/clickhouse/config.xml is a file with no matching content in template.toml; dropped
- [partial] `signoz-clickhouse` bind-mount: bind mount ../files/clickhouse/cluster.xml is a file with no matching content in template.toml; dropped
- [partial] `signoz-clickhouse` bind-mount: bind mount ../files/clickhouse/docker_related_config.xml is a file with no matching content in template.toml; dropped
- [partial] `signoz` bind-mount: bind mount ../files/signoz/prometheus.yml is a file with no matching content in template.toml; dropped
- [partial] `signoz` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `signoz-otel-collector` bind-mount: bind mount ../files/collector/otel-collector-config.yaml is a file with no matching content in template.toml; dropped
