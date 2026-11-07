# sim

Status: **partial**

- [partial] `sim-realtime` path-routing: Haloy routes by hostname only; /socket.io on app.example.com became socket-io.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `simstudio` internal-ref-to-public: simstudio is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] `sim-realtime` internal-ref-to-public: sim-realtime is reached by hostname from another service but has a domain; with rolling deploys its container name changes
