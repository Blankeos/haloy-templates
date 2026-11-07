# capso

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `capso-minio` extra-port: Haloy exposes one port per target; port 3903 (minio_domain_2) is not published, only 3902 is. Reach it with `haloy tunnel` or a separate reverse proxy.
- [partial] `capso-minio` internal-ref-to-public: capso-minio is reached by hostname from another service but has a domain; with rolling deploys its container name changes
