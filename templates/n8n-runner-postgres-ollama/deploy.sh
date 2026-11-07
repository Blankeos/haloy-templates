#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t n8n-runner-postgres-ollama-postgres
haloy deploy -t n8n-runner-postgres-ollama-redis
haloy deploy -t n8n-runner-postgres-ollama-n8n
haloy deploy -t n8n-runner-postgres-ollama-n8n-worker
haloy deploy -t n8n-runner-postgres-ollama-n8n-runner
haloy deploy -t n8n-runner-postgres-ollama-ollama
haloy deploy -t n8n-runner-postgres-ollama-init-ollama
