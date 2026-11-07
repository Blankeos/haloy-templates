#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t seafile-db
haloy deploy -t seafile-redis
haloy deploy -t seafile
haloy deploy -t seafile-seadoc
