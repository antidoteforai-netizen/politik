#!/bin/sh
# Génère dashboard/telechargements/politik-police-gendarmerie-infographie.pdf depuis dashboard/infographie-police.html
# avec Google Chrome en mode headless (polices Google chargées en ligne). Usage : sh scripts/build-infographie.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="$ROOT/dashboard/telechargements/politik-police-gendarmerie-infographie.pdf"
mkdir -p "$ROOT/dashboard/telechargements"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$OUT" "file://$ROOT/dashboard/infographie-police.html" >/dev/null 2>&1
echo "OK : $OUT ($(wc -c < "$OUT") octets, $(grep -a -c '/Type /Page$\|/Type /Page[^s]' "$OUT") pages)"
