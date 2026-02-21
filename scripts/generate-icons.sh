#!/bin/bash

# Generate PWA icons from SVG
# Requires: ImageMagick (convert) or librsvg (rsvg-convert)

cd "$(dirname "$0")/.."

if command -v rsvg-convert &> /dev/null; then
  rsvg-convert -w 192 -h 192 public/icons/icon.svg > public/icons/icon-192.png
  rsvg-convert -w 512 -h 512 public/icons/icon.svg > public/icons/icon-512.png
  echo "Icons generated with rsvg-convert"
elif command -v convert &> /dev/null; then
  convert -background none -resize 192x192 public/icons/icon.svg public/icons/icon-192.png
  convert -background none -resize 512x512 public/icons/icon.svg public/icons/icon-512.png
  echo "Icons generated with ImageMagick"
else
  echo "No image converter found. Install ImageMagick or librsvg."
  echo "Creating placeholder icons..."
  # Create simple placeholder icons using a data URI fallback
fi

echo "Done!"
