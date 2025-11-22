#!/bin/bash
# Remove all ======================================== separator lines from JavaScript files

cd /workspaces/XPSite

for file in script.js boot.js settings.js mediaplayer.js paint.js minesweeper.js solitaire.js; do
  if [ -f "$file" ]; then
    sed -i '/^\/\/ ========================================$/d' "$file"
    echo "✓ Processed $file"
  fi
done

echo ""
echo "Done! All separator lines removed."
