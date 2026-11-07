#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t evolutiongo-evolution-postgres
haloy deploy -t evolutiongo-evolution-go
haloy deploy -t evolutiongo-evolution-gateway
