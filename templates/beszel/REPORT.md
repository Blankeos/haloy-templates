# beszel

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)
Badge: 🟢 tested (amd64, haloy v0.1.0-beta.73, 2026-11-07): Production (netc, 2026-11-07): hub deployed with a Let's Encrypt cert and shows server and per-container stats from a host-network agent (run with docker, not Haloy, since it needs host networking and the Docker socket). Hub image bumped to 0.21.1 and the docker.sock mount removed from the hub.

- [partial] `beszel` docker-sock: mounts the host Docker socket (works as a plain bind mount, but gives the container control of every container on the server)
