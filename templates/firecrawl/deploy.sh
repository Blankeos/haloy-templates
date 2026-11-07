#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t firecrawl-db
haloy deploy -t firecrawl-db-seed
haloy deploy -t firecrawl-nuq-postgres
haloy deploy -t firecrawl-redis
haloy deploy -t firecrawl-rabbitmq
haloy deploy -t firecrawl-playwright-service
haloy deploy -t firecrawl
haloy deploy -t firecrawl-swagger-ui
haloy deploy -t firecrawl-gateway
