# nebulynk

Status: **manual**

- [manual] `nebulynk-frontend` build: service uses `build:`; template must be built from its own source and pushed to a registry first
- [manual] `nebulynk-backend` build: service uses `build:`; template must be built from its own source and pushed to a registry first
- [manual] `nebulynk-transcription-worker` build: service uses `build:`; template must be built from its own source and pushed to a registry first
- [partial] `nebulynk-transcription-worker` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
- [partial] `nebulynk-garage` internal-ref-to-public: nebulynk-garage is reached by hostname from another service but has a domain; with rolling deploys its container name changes
- [partial] `nebulynk-livekit` internal-ref-to-public: nebulynk-livekit is reached by hostname from another service but has a domain; with rolling deploys its container name changes
