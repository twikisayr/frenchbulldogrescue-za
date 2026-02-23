#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INBOX="$ROOT/assets-inbox/nano-banana"
OUT="$ROOT/public/assets"

mkdir -p "$OUT"

# Requires ImageMagick (`magick` preferred, fallback `convert`)
if command -v magick >/dev/null 2>&1; then
  IM="magick"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"
else
  echo "ImageMagick not found (magick/convert). Install imagemagick first." >&2
  exit 1
fi

# Naming map (drop files with these exact names into inbox)
# hero-frenchie-surrender.(jpg|png|webp)
# section-surrender-process.(jpg|png|webp)
# section-frenchie-care.(jpg|png|webp)
# section-rescue-network.(jpg|png|webp)
# og-frenchie-surrender.(jpg|png|webp)

for base in hero-frenchie-surrender section-surrender-process section-frenchie-care section-rescue-network og-frenchie-surrender; do
  src=""
  for ext in jpg jpeg png webp; do
    if [[ -f "$INBOX/$base.$ext" ]]; then src="$INBOX/$base.$ext"; break; fi
  done
  if [[ -z "$src" ]]; then
    echo "skip: $base (missing)"
    continue
  fi

  if [[ "$base" == og-* ]]; then
    "$IM" "$src" -resize 1200x630^ -gravity center -extent 1200x630 -quality 82 "$OUT/$base.jpg"
  else
    "$IM" "$src" -resize 1600x1000^ -gravity center -extent 1600x1000 -quality 84 "$OUT/$base.jpg"
    "$IM" "$src" -resize 1600x1000^ -gravity center -extent 1600x1000 -quality 80 "$OUT/$base.webp"
  fi

  echo "processed: $base"
done

echo "done: $OUT"
