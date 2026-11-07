#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t fluxer-postgres
haloy deploy -t fluxer-valkey
haloy deploy -t fluxer-nats
haloy deploy -t fluxer-meilisearch
haloy deploy -t fluxer-seaweedfs
haloy deploy -t fluxer-seaweedfs-init
haloy deploy -t fluxer-snowflakes
haloy deploy -t fluxer-snowflakes-shard
haloy deploy -t fluxer-messages
haloy deploy -t fluxer-messages-shard
haloy deploy -t fluxer-users
haloy deploy -t fluxer-users-shard
haloy deploy -t fluxer-api
haloy deploy -t fluxer-gateway
haloy deploy -t fluxer-media-proxy
haloy deploy -t fluxer-static-proxy
haloy deploy -t fluxer-admin
haloy deploy -t fluxer-caddy
haloy deploy -t fluxer-gifs
haloy deploy -t fluxer-gifs-shard
haloy deploy -t fluxer-livekit
haloy deploy -t fluxer-worker
haloy deploy -t fluxer-app-proxy
haloy deploy -t fluxer-unfurl
haloy deploy -t fluxer-unfurl-shard
