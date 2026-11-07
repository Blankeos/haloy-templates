#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t chirpstack-postgres
haloy deploy -t chirpstack-mosquitto
haloy deploy -t chirpstack-redis
haloy deploy -t chirpstack
haloy deploy -t chirpstack-gateway-bridge
haloy deploy -t chirpstack-gateway-bridge-basicstation
haloy deploy -t chirpstack-rest-api
