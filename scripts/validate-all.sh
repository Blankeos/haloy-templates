#!/usr/bin/env bash
# Run `haloy validate-config` on every bundled template (needs the haloy CLI on PATH).
set -u
export PATH="$HOME/.local/bin:$PATH"
root="$(cd "$(dirname "$0")/.." && pwd)"
ok=0; bad=0; fails=$(mktemp)
for d in "$root"/templates/*/; do
  n=$(basename "$d")
  if out=$(cd "$d" && eval "$(bun "$root/src/cli.ts" env "$n" | sed 's/^/export /')" && haloy validate-config 2>&1); then ok=$((ok+1))
  else bad=$((bad+1)); echo "$n: $(grep '✖' <<<"$out" | head -1)" >> "$fails"; fi
done
echo "valid=$ok invalid=$bad"; cat "$fails"; rm -f "$fails"
[ "$bad" -eq 0 ]
