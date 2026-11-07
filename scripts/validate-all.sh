#!/usr/bin/env bash
# Run `haloy validate-config` on every bundled template (needs the haloy CLI on PATH).
set -u
export PATH="$HOME/.local/bin:$PATH"
root="$(cd "$(dirname "$0")/.." && pwd)"
ok=0; bad=0; fails=$(mktemp); passed=$(mktemp)
for d in "$root"/templates/*/; do
  n=$(basename "$d")
  if out=$(cd "$d" && eval "$(bun "$root/src/cli.ts" env "$n" | sed 's/^/export /')" && haloy validate-config 2>&1); then ok=$((ok+1)); echo "$n" >> "$passed"
  else bad=$((bad+1)); echo "$n: $(grep '✖' <<<"$out" | head -1)" >> "$fails"; fi
done
echo "valid=$ok invalid=$bad"; cat "$fails"
ver=$(haloy version 2>/dev/null | grep -oE 'v?[0-9]+\.[0-9]+\.[0-9]+[-a-z0-9.]*' | head -1)
# record every pass (after the loop, so hashes match the files just validated)
[ -s "$passed" ] && bun "$root/src/cli.ts" record verified --haloy "${ver:-unknown}" $(cat "$passed" | tr '\n' ' ')
rm -f "$fails" "$passed"
[ "$bad" -eq 0 ]
