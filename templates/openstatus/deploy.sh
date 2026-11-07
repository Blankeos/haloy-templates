#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t openstatus-libsql
haloy deploy -t openstatus-db-migrate
haloy deploy -t openstatus-workflows
haloy deploy -t openstatus-server
haloy deploy -t openstatus-dashboard
haloy deploy -t openstatus-status-page
haloy deploy -t openstatus-private-location
