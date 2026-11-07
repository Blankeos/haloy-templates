# emqx

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `emqx` extra-port: Haloy exposes one port per target; port 8083 (broker.yourdomain.com) is not published, only 18083 is. Reach it with `haloy tunnel` or a separate reverse proxy.
- [partial] `emqx` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
