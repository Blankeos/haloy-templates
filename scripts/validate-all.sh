#!/usr/bin/env bash
# Run `haloy validate-config` on every translated template in <out dir>.
set -u
export PATH="$HOME/.local/bin:$PATH"
dir="${1:?usage: validate-all.sh <out dir>}"
fails=$(mktemp); ok=0; bad=0
for d in "$dir"/*/; do
  n=$(basename "$d")
  if out=$(cd "$d" && set -a && { [ -f .env ] && . ./.env; true; } && set +a && haloy validate-config 2>&1); then ok=$((ok+1))
  else bad=$((bad+1)); echo "$n: $(grep '✖' <<<"$out" | head -1)" >> "$fails"; fi
done
echo "valid=$ok invalid=$bad"; cat "$fails"; rm -f "$fails"
