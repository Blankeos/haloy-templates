#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t penpot-postgres
haloy deploy -t penpot-redis
haloy deploy -t penpot-backend
haloy deploy -t penpot-exporter
haloy deploy -t penpot-frontend
haloy deploy -t penpot-mailcatch
