#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t mautic-mysql
haloy deploy -t mautic
haloy deploy -t mautic-cron
haloy deploy -t mautic-worker
haloy deploy -t mautic-phpmyadmin
