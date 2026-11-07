# ethora-core

Status: **manual**

- [manual] `ethora-core-config` unsupported-env_file: env_file (inline the values) has no Haloy equivalent
- [partial] `ethora-core-centrifugo` path-routing: Haloy routes by hostname only; /connection/websocket on app.app.example.com became connection-websocket.app.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `ethora-core-xmpp` path-routing: Haloy routes by hostname only; /ws on xmpp.app.example.com became ws.xmpp.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `ethora-core-xmpp` path-routing: Haloy routes by hostname only; /bosh on xmpp.app.example.com became bosh.xmpp.app.example.com. Point DNS there and update any URL env vars (e.g. BASE_URL).
- [partial] `ethora-core-xmpp` healthcheck: command-style healthcheck dropped (Haloy supports HTTP path checks only)
