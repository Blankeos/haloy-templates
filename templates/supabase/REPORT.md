# supabase

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `supabase-api-gw` bind-mount: bind mount ../files/volumes/api/envoy/envoy.yaml is a file with no matching content in template.toml; dropped
- [partial] `supabase-api-gw` bind-mount: bind mount ../files/volumes/api/envoy/cds.yaml is a file with no matching content in template.toml; dropped
- [partial] `supabase-api-gw` bind-mount: bind mount ../files/volumes/api/envoy/lds.template.yaml is a file with no matching content in template.toml; dropped
- [partial] `supabase-api-gw` bind-mount: bind mount ../files/volumes/api/envoy/docker-entrypoint.sh is a file with no matching content in template.toml; dropped
- [partial] `supabase-api-gw` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `supabase-rest` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `supabase-storage` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `supabase-imgproxy` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `supabase-functions` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `supabase-db` bind-mount: bind mount ../files/volumes/db/realtime.sql is a file with no matching content in template.toml; dropped
- [partial] `supabase-db` bind-mount: bind mount ../files/volumes/db/webhooks.sql is a file with no matching content in template.toml; dropped
- [partial] `supabase-db` bind-mount: bind mount ../files/volumes/db/roles.sql is a file with no matching content in template.toml; dropped
- [partial] `supabase-db` bind-mount: bind mount ../files/volumes/db/jwt.sql is a file with no matching content in template.toml; dropped
- [partial] `supabase-db` bind-mount: bind mount ../files/volumes/db/_supabase.sql is a file with no matching content in template.toml; dropped
- [partial] `supabase-db` bind-mount: bind mount ../files/volumes/db/logs.sql is a file with no matching content in template.toml; dropped
- [partial] `supabase-db` bind-mount: bind mount ../files/volumes/db/pooler.sql is a file with no matching content in template.toml; dropped
- [partial] `supabase-supavisor` bind-mount: bind mount ../files/volumes/pooler/pooler.exs is a file with no matching content in template.toml; dropped
- [partial] `supabase-api-gw` internal-ref-to-public: supabase-api-gw is reached by hostname from another service but has a domain; with rolling deploys its container name changes
