#!/usr/bin/env python3
import os

# List of JavaScript files to process
js_files = [
    "script.js",
    "boot.js",
    "portfolio.js",
    "settings.js",
    "mediaplayer.js",
    "paint.js",
    "minesweeper.js",
    "solitaire.js"
]

# Process each JavaScript file
for js_file in js_files:
    if os.path.exists(js_file):
        with open(js_file, 'r') as f:
            content = f.read()
        
        # Remove all lines that are exactly "// ========================================\n" or just "// ========================================"
        lines = content.split('\n')
        filtered_lines = [line for line in lines if line.strip() != "// ========================================"]
        
        with open(js_file, 'w') as f:
            f.write('\n'.join(filtered_lines))
        
        print(f"✓ Processed {js_file}")

print("\nDone! All separator lines removed from JavaScript files.")
