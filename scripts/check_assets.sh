#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

required=(
  "public/assets/hero-frenchie-surrender.jpg"
  "public/assets/section-surrender-process.jpg"
  "public/assets/section-frenchie-care.jpg"
  "public/assets/section-rescue-network.jpg"
  "public/assets/og-frenchie-surrender.jpg"
)

fail=0
for f in "${required[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "MISSING: $f"
    fail=1
  fi
done

if [[ $fail -ne 0 ]]; then
  echo "asset check failed"
  exit 1
fi

echo "asset check passed"
