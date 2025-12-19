#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ICONS_DIR="$(dirname "$SCRIPT_DIR")/icons"

cd "$ICONS_DIR"

# Check for source PNGs
if [ ! -f "raw/icon_mac.png" ]; then
  echo "Error: icon_mac.png not found in build/resources/icons/raw folder"
  exit 1
fi

if [ ! -f "raw/icon_others.png" ]; then
  echo "Error: icon_others.png not found in build/resources/icons/raw folder"
  exit 1
fi

# Create platform folders if they don't exist, and wipe existing contents
for platform in mac windows linux; do
  rm -rf "$platform"
  mkdir -p "$platform"
done

# --- macOS: Build ICNS ---
echo "Creating icon.icns for macOS..."
mkdir -p mac/icon.iconset
sips -z 16 16     raw/icon_mac.png --out mac/icon.iconset/icon_16x16.png
sips -z 32 32     raw/icon_mac.png --out mac/icon.iconset/icon_16x16@2x.png
sips -z 32 32     raw/icon_mac.png --out mac/icon.iconset/icon_32x32.png
sips -z 64 64     raw/icon_mac.png --out mac/icon.iconset/icon_32x32@2x.png
sips -z 128 128   raw/icon_mac.png --out mac/icon.iconset/icon_128x128.png
sips -z 256 256   raw/icon_mac.png --out mac/icon.iconset/icon_128x128@2x.png
sips -z 256 256   raw/icon_mac.png --out mac/icon.iconset/icon_256x256.png
sips -z 512 512   raw/icon_mac.png --out mac/icon.iconset/icon_256x256@2x.png
sips -z 512 512   raw/icon_mac.png --out mac/icon.iconset/icon_512x512.png
sips -z 1024 1024 raw/icon_mac.png --out mac/icon.iconset/icon_512x512@2x.png
iconutil -c icns mac/icon.iconset -o mac/icon.icns
rm -rf mac/icon.iconset
echo "Done: mac/icon.icns created"

# --- Windows: Build ICO ---
if command -v magick &> /dev/null; then
  echo "Creating icon.ico for Windows..."
  magick raw/icon_others.png -define icon:auto-resize=256,128,64,48,32,16 windows/icon.ico
  echo "Done: windows/icon.ico created"
else
  echo "Error: ImageMagick not found. Cannot create icon.ico."
  echo "Install with: brew install imagemagick"
  exit 1
fi

# --- Linux: Copy PNG ---
echo "Copying icon.png for Linux..."
cp raw/icon_others.png linux/icon.png
echo "Done: linux/icon.png created"

echo ""
echo "All platform icons built successfully!"
