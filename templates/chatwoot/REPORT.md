# chatwoot

Status: **partial**
Badge: 🟢 tested (amd64, haloy v0.1.0-beta.73, 2026-11-07): Production (netc, 2026-11-07): restored real data, login and conversations work. Rails boots slower than Haloy's health window, so the web target runs as a service behind the generated nginx gateway.

- [partial] `chatwoot-gateway` path-routing: Haloy routes by hostname only, so app.example.com (/) is served by a generated nginx target `chatwoot-gateway` that proxies each path to its service.
