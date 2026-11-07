#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t flagsmith-postgres
haloy deploy -t flagsmith
haloy deploy -t flagsmith-task-processor
