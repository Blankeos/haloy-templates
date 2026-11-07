# reef-dev-cluster

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `reef-dev-cluster` extra-port: Haloy exposes one port per target; port 9945 (ws.app.example.com) is not published, only 8001 is. Reach it with `haloy tunnel` or a separate reverse proxy.
- [partial] `reef-dev-cluster` extra-port: Haloy exposes one port per target; port 8080 (faucet.app.example.com) is not published, only 8001 is. Reach it with `haloy tunnel` or a separate reverse proxy.
- [partial] `reef-dev-cluster` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `reef-dev-cluster-eth-rpc` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `reef-dev-cluster` internal-ref-to-public: reef-dev-cluster is reached by hostname from another service but has a domain; with rolling deploys its container name changes
