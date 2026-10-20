#!/bin/sh
# Génère dashboard/og-politik.png (1200 x 630) depuis dashboard/og-politik.html avec Google Chrome en mode headless.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --window-size=1200,630 \
  --screenshot="$ROOT/dashboard/og-politik.png" "file://$ROOT/dashboard/og-politik.html" >/dev/null 2>&1
echo "OK : $ROOT/dashboard/og-politik.png ($(wc -c < "$ROOT/dashboard/og-politik.png") octets)"
