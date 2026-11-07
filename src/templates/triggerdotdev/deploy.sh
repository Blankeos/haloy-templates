#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t triggerdotdev-postgres
haloy deploy -t triggerdotdev-redis
haloy deploy -t triggerdotdev-webapp
haloy deploy -t triggerdotdev-docker-provider
haloy deploy -t triggerdotdev-coordinator
haloy deploy -t triggerdotdev-electric
