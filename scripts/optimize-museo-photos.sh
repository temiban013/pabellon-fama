#!/usr/bin/env bash
# Optimize the museum tour photos for the web.
#
# Source : /home/temiban/Downloads/Photos-3-001 (89 Pixel 8 Pro JPEGs, ~1-2MB each)
# Output : public/images/museo/tour/fotos/foto-NN.jpg (max 1600px, q82)
#          public/images/museo/tour/fotos/foto-NN-thumb.jpg (max 480px, q80)
#
# Photos are processed in filename-sorted order, which is chronological capture order.
# NOTE: the multi-frame capture groups (...MP~2/~3/~4/~5.jpg) are NOT duplicates — they are a
# wide shot plus its own zoomed close-ups. We keep them ALL; the manifest groups them per hotspot.
#
# Requires ImageMagick (`convert`). Idempotent: re-running regenerates the same files.
set -euo pipefail

SRC="${1:-/home/temiban/Downloads/Photos-3-001}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/images/museo/tour/fotos"

mkdir -p "$OUT"
i=0
while IFS= read -r f; do
  i=$((i + 1))
  nn=$(printf "%02d" "$i")
  convert "$SRC/$f" -auto-orient -resize '1600x1600>' -strip -quality 82 "$OUT/foto-$nn.jpg"
  convert "$SRC/$f" -auto-orient -resize '480x480>'  -strip -quality 80 "$OUT/foto-$nn-thumb.jpg"
done < <(ls "$SRC" | sort)

echo "Optimized $i photos into $OUT"
