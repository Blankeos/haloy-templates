# teable

Status: **partial**

- [partial] `teable-db` host-ports: published host ports (${TEABLE_DB_PORT}:${POSTGRES_PORT}) are not exposed by Haloy; use `haloy tunnel` or add a domain
- [partial] `teable` internal-ref-to-public: teable is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] unset-vars: 7 optional vars have no value in template.toml and were left empty/omitted: BACKEND_MAIL_HOST, BACKEND_MAIL_PORT, BACKEND_MAIL_SECURE, BACKEND_MAIL_SENDER, BACKEND_MAIL_SENDER_NAME, BACKEND_MAIL_AUTH_USER, BACKEND_MAIL_AUTH_PASS
