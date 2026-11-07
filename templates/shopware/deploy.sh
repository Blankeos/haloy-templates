#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t shopware-database
haloy deploy -t shopware-redis
haloy deploy -t shopware-bootstrap
haloy deploy -t shopware-init-permissions
haloy deploy -t shopware-init
haloy deploy -t shopware
haloy deploy -t shopware-worker
haloy deploy -t shopware-scheduler
