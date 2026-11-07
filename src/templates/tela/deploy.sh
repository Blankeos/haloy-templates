#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t tela-postgres
haloy deploy -t tela-backend
haloy deploy -t tela-frontend
haloy deploy -t tela-proxy
haloy deploy -t tela-deck
haloy deploy -t tela-gotenberg
