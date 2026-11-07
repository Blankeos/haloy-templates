# reactive-resume

Status: **partial**

- [partial] `reactive-resume-minio` path-routing: Haloy routes by hostname only; /default on app.example.com became default.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `reactive-resume-minio` internal-ref-to-public: reactive-resume-minio is reached by hostname from another service but has a domain; with rolling deploys its container name changes
