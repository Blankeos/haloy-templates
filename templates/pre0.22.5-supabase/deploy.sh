#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t pre0-22-5-supabase-vector
haloy deploy -t pre0-22-5-supabase-db
haloy deploy -t pre0-22-5-supabase-analytics
haloy deploy -t pre0-22-5-supabase-studio
haloy deploy -t pre0-22-5-supabase-kong
haloy deploy -t pre0-22-5-supabase-auth
haloy deploy -t pre0-22-5-supabase-rest
haloy deploy -t pre0-22-5-supabase-realtime
haloy deploy -t pre0-22-5-supabase-imgproxy
haloy deploy -t pre0-22-5-supabase-storage
haloy deploy -t pre0-22-5-supabase-meta
haloy deploy -t pre0-22-5-supabase-functions
haloy deploy -t pre0-22-5-supabase-supavisor
