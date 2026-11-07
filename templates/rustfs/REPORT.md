# rustfs

Status: **partial**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)
Badge: 🟢 tested (arm64, haloy v0.1.0-beta.73, 2026-11-07): S3 API on the domain: create bucket, put and get object; bad credentials rejected. Console (9001) not published

- [partial] `rustfs` extra-port: Haloy exposes one port per target; port 9001 (app.example.com) is not published, only 9000 is. Reach it with `haloy tunnel` or a separate reverse proxy.
