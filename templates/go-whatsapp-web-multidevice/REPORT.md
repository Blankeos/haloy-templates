# go-whatsapp-web-multidevice

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [partial] `go-whatsapp-web-multidevice-whatsapp` entrypoint-wrapped: command needs env expansion, so it runs via `sh -c`; if the image's own ENTRYPOINT matters, check it still starts correctly
