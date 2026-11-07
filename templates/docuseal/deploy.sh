#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t docuseal-docu-postgres
haloy deploy -t docuseal-app
haloy deploy -t docuseal-docu-redis
