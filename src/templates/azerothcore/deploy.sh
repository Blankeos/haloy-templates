#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t azerothcore-database
haloy deploy -t azerothcore-db-import
haloy deploy -t azerothcore-client-data
haloy deploy -t azerothcore-realm-config
haloy deploy -t azerothcore-auth
haloy deploy -t azerothcore
