# languagetool

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `languagetool-gateway` path-routing: Haloy routes by hostname only, so app.example.com (/v2/languages) is served by a generated nginx target `languagetool-gateway` that proxies each path to its service.
