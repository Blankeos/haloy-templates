#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t zabbix-postgres
haloy deploy -t zabbix-java-gateway
haloy deploy -t zabbix-snmptraps
haloy deploy -t zabbix-server-pgsql
haloy deploy -t zabbix-web-nginx-pgsql
