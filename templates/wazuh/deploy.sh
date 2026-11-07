#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t wazuh-certs
haloy deploy -t wazuh-indexer-init
haloy deploy -t wazuh-indexer
haloy deploy -t wazuh-manager
haloy deploy -t wazuh
