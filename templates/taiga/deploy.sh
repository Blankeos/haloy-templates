#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t taiga-db
haloy deploy -t taiga-events-rabbitmq
haloy deploy -t taiga-async-rabbitmq
haloy deploy -t taiga-back
haloy deploy -t taiga-async
haloy deploy -t taiga-front
haloy deploy -t taiga-events
haloy deploy -t taiga-protected
haloy deploy -t taiga-gateway
