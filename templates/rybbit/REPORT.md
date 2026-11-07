# rybbit

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)
Badge: 🟢 tested (arm64, haloy v0.1.0-beta.73, 2026-11-07): all 6 targets up; /api and / both served on one host by the gateway; sign-up and session work; Postgres and ClickHouse connected

- [partial] `rybbit-gateway` path-routing: Haloy routes by hostname only, so app.example.com (/api, /) is served by a generated nginx target `rybbit-gateway` that proxies each path to its service.
