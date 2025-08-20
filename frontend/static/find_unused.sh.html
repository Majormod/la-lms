#!/bin/bash

# This script finds image files in an image directory that are not referenced
# anywhere in the project's source code (HTML, CSS, JS).
# VERSION 3: Excludes both the image directory AND the .git directory.

PROJECT_DIR="."
IMAGE_DIR="assets/images"

echo "Searching for unused images with the final script..."

find "${IMAGE_DIR}" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.svg" \) | while read -r image_path
do
  filename=$(basename "$image_path")

  # THE FIX: We now also exclude the ".git" directory from the search.
  if ! grep -q -r --exclude-dir="${IMAGE_DIR}" --exclude-dir=".git" "${filename}" "${PROJECT_DIR}"
  then
    # If the filename was not found, it is likely unused.
    echo "$image_path"
  fi
done

echo "Search complete."