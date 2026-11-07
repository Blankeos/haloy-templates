#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t bigcapital-mysql
haloy deploy -t bigcapital-mongo
haloy deploy -t bigcapital-redis
haloy deploy -t bigcapital-server
haloy deploy -t bigcapital-webapp
haloy deploy -t bigcapital-gotenberg
