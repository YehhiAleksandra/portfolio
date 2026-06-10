#!/usr/bin/env bash
# Convert portfolio images to real WebP + PNG fallbacks.
# Hero: auto cutout (transparent background) for the floating contour look.
#
# Usage:
#   Put sources as assets/hero-character-source.png (or .png), then:
#   ./scripts/optimize-media.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$ROOT/assets"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1" >&2; exit 1; }; }
need cwebp
need convert
need python3

src_for() {
  local base="$1"
  if [[ -f "$ASSETS/${base}-source.png" ]]; then
    echo "$ASSETS/${base}-source.png"
  elif [[ -f "$ASSETS/${base}.png" ]] && file -b "$ASSETS/${base}.png" | grep -q PNG; then
    cp "$ASSETS/${base}.png" "$TMP/${base}-in.png"
    echo "$TMP/${base}-in.png"
  elif [[ -f "$ASSETS/${base}.webp" ]] && file -b "$ASSETS/${base}.webp" | grep -q PNG; then
    cp "$ASSETS/${base}.webp" "$TMP/${base}-in.png"
    echo "$TMP/${base}-in.png"
  else
    echo ""
  fi
}

encode_cutout() {
  local base="$1"
  local src="$2"
  local cut="$TMP/${base}-cutout.png"

  echo "==> $base (cutout + alpha)"
  python3 - <<PY
from rembg import remove
from PIL import Image
Image.open("$src").pipe(remove).save("$cut")
PY
  cwebp -quiet -q 90 -alpha_q 100 -m 6 "$cut" -o "$ASSETS/${base}.webp"
  convert "$cut" -strip -define png:compression-level=9 "$ASSETS/${base}.png"
}

encode_photo() {
  local base="$1"
  local src="$2"

  echo "==> $base (photo)"
  cwebp -quiet -q 88 -m 6 "$src" -o "$ASSETS/${base}.webp"
  convert "$src" -strip -define png:compression-level=9 "$ASSETS/${base}.png"
}

hero_src="$(src_for hero-character)"
if [[ -n "$hero_src" ]]; then
  encode_cutout hero-character "$hero_src"
  python3 "$ROOT/scripts/build-og-preview.py" "$TMP/hero-character-cutout.png"
fi

train_src="$(src_for train-character)"
[[ -n "$train_src" ]] && encode_photo train-character "$train_src"

if [[ -f "$ASSETS/workspace.png" ]]; then
  encode_photo workspace "$ASSETS/workspace.png"
fi

echo
echo "Done:"
ls -lh "$ASSETS"/hero-character.* "$ASSETS"/train-character.* "$ASSETS"/og-preview.png 2>/dev/null || true
