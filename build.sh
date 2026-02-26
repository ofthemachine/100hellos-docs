#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HELLOS_DIR="$MONOREPO_ROOT/100hellos"
FRAGLET_DIR="$MONOREPO_ROOT/fraglet"
OUTPUT_DIR="${OUTPUT_DIR:-$SCRIPT_DIR/public}"

IMAGE_NAME="ofthemachine/100hellos-docs:local"

echo "==> Checking out hackathon branches..."
(cd "$HELLOS_DIR" && git fetch origin && git checkout origin/hackathon-branch-handoff)
(cd "$FRAGLET_DIR" && git fetch origin && git checkout origin/hackathon-branch-handoff)

echo "==> Building docs container..."
docker build -t "$IMAGE_NAME" "$SCRIPT_DIR"

mkdir -p "$OUTPUT_DIR"

echo "==> Running build (preprocess + gatsby build)..."
docker run --rm \
  --platform="linux/amd64" \
  -v "$HELLOS_DIR":/mnt/100hellos:ro \
  -v "$FRAGLET_DIR":/mnt/fraglet:ro \
  -v "$OUTPUT_DIR":/static_site \
  -e UID="$(id -u)" \
  -e GID="$(id -g)" \
  "$IMAGE_NAME"

echo ""
echo "==> Build complete. Output at: $OUTPUT_DIR"
echo ""
echo "Serve locally with:"
echo "  docker run --rm -v '$OUTPUT_DIR':/usr/share/nginx/html:ro -p 8080:80 nginx:alpine"
echo ""
echo "Then open http://localhost:8080"
