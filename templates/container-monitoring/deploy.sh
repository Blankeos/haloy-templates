#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t container-monitoring-cadvisor
haloy deploy -t container-monitoring-node-exporter
haloy deploy -t container-monitoring-prometheus
haloy deploy -t container-monitoring-grafana
