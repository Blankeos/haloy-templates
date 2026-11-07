# pre0.22.5-supabase

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `pre0-22-5-supabase-studio` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `pre0-22-5-supabase-kong` bind-mount: bind mount ../files/volumes/api/kong.yml is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-storage` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `pre0-22-5-supabase-imgproxy` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `pre0-22-5-supabase-db` bind-mount: bind mount ../files/volumes/db/realtime.sql is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-db` bind-mount: bind mount ../files/volumes/db/webhooks.sql is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-db` bind-mount: bind mount ../files/volumes/db/roles.sql is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-db` bind-mount: bind mount ../files/volumes/db/jwt.sql is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-db` bind-mount: bind mount ../files/volumes/db/_supabase.sql is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-db` bind-mount: bind mount ../files/volumes/db/logs.sql is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-db` bind-mount: bind mount ../files/volumes/db/pooler.sql is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-vector` bind-mount: bind mount ../files/volumes/logs/vector.yml is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-vector` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
- [partial] `pre0-22-5-supabase-vector` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `pre0-22-5-supabase-supavisor` bind-mount: bind mount ../files/volumes/pooler/pooler.exs is a file with no matching content in template.toml; dropped
- [partial] `pre0-22-5-supabase-supavisor` host-ports: published host ports (${POSTGRES_PORT}:5432, ${POOLER_PROXY_PORT_TRANSACTION}:6543) are not exposed by Haloy; use `haloy tunnel` or add a domain
- [partial] `pre0-22-5-supabase-kong` internal-ref-to-public: pre0-22-5-supabase-kong is reached by hostname from another service but has a domain; with rolling deploys its container name changes
