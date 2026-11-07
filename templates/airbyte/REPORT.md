# airbyte

Status: **manual**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `airbyte-db` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `airbyte-temporal` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `airbyte-k3s` unsupported-privileged: privileged mode has no Haloy equivalent
- [partial] `airbyte-k3s` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `airbyte-docker-dns` unsupported-network_mode: custom network_mode has no Haloy equivalent
- [partial] `airbyte-docker-dns` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `airbyte-bootloader` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [manual] `airbyte-server` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `airbyte-server` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `airbyte-manifest-server` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [manual] `airbyte-workload-api-server` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `airbyte-workload-api-server` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `airbyte-worker` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `airbyte-worker` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `airbyte-cron` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `airbyte-cron` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [manual] `airbyte-workload-launcher` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `airbyte-workload-launcher` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `airbyte-server` internal-ref-to-public: airbyte-server is reached by hostname from another service but has a domain; with rolling deploys its container name changes
