#!/usr/bin/env python3
import re
import os

# List of JavaScript files to process
js_files = [
    "script.js",
    "boot.js",
    "settings.js",
    "mediaplayer.js",
    "paint.js",
    "minesweeper.js",
    "solitaire.js"
]

def uppercase_comment(match):
    """Convert comment text to uppercase while preserving the // prefix"""
    comment_text = match.group(1)
    return f"//{comment_text.upper()}"

# Process each JavaScript file
for js_file in js_files:
    if os.path.exists(js_file):
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace single-line comments: // comment -> // COMMENT
        # This regex matches // followed by any text until end of line
        content = re.sub(r'//(.+?)$', uppercase_comment, content, flags=re.MULTILINE)
        
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Converted comments to uppercase in {js_file}")

print("\n✅ Done! All comments converted to uppercase.")
