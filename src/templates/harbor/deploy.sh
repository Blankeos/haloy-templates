#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t harbor-init
haloy deploy -t harbor-postgresql
haloy deploy -t harbor-redis
haloy deploy -t harbor-registry
haloy deploy -t harbor-core
haloy deploy -t harbor-registryctl
haloy deploy -t harbor-jobservice
haloy deploy -t harbor-portal
haloy deploy -t harbor-exporter
haloy deploy -t harbor-proxy
haloy deploy -t harbor-trivy-adapter
