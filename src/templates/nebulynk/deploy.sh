#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t nebulynk-postgres
haloy deploy -t nebulynk-redis
haloy deploy -t nebulynk-garage-volume-init
haloy deploy -t nebulynk-garage
haloy deploy -t nebulynk-livekit
haloy deploy -t nebulynk-livekit-egress
haloy deploy -t nebulynk-backend
haloy deploy -t nebulynk-frontend
haloy deploy -t nebulynk-transcription-worker
