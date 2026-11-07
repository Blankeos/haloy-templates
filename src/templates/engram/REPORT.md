# engram

Status: **partial**

- [partial] `engram` path-routing: Haloy routes by hostname only; /dashboard on app.example.com became dashboard.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `engram` internal-ref-to-public: engram is reached by hostname from another service but has a domain; with rolling deploys its container name changes
