#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 ./scripts/generate_nano_images.py
./scripts/process_images.sh
./scripts/check_assets.sh

git add public/assets assets-inbox/nano-banana || true
if git diff --cached --quiet; then
  echo "No image changes to commit."
  exit 0
fi

git commit -m "Update website imagery via Nano Banana pipeline"
git push

echo "Published Nano image update."
