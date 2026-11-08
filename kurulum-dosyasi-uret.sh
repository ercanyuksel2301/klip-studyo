#!/bin/bash
# Mac'te .dmg, Linux'ta .AppImage üretir (her sistem kendi türünü üretir)
cd "$(dirname "$0")"
npm install || exit 1
case "$(uname)" in
  Darwin) npm run dist:mac ;;
  *)      npm run dist:linux ;;
esac
echo "BITTI: dist klasorune bakin."
