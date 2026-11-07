#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t evolutioncrm-postgres
haloy deploy -t evolutioncrm-redis
haloy deploy -t evolutioncrm-evo-auth
haloy deploy -t evolutioncrm-evo-auth-sidekiq
haloy deploy -t evolutioncrm-evo-crm
haloy deploy -t evolutioncrm-evo-crm-sidekiq
haloy deploy -t evolutioncrm-evo-core
haloy deploy -t evolutioncrm-evo-processor
haloy deploy -t evolutioncrm-evo-bot-runtime
haloy deploy -t evolutioncrm-evo-crm-frontend
