# powersync

Status: **partial**

- [partial] `powersync` path-routing: Haloy routes by hostname only; /probes/liveness on app.example.com became probes-liveness.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `powersync` internal-ref-to-public: powersync is reached by hostname from another service but has a domain; with rolling deploys its container name changes
