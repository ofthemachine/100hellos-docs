#!/usr/bin/env bash

set -euo pipefail

warn () {
  echo >&2 "warning : $@"
}

die () {
  echo >&2 "$@"
  exit 1
}

if ! test -d /mnt/100hellos ; then
  die "fatal : /mnt/100hellos not mounted. Mount the 100hellos repo as a read-only volume."
fi

if ! test -d /mnt/fraglet ; then
  die "fatal : /mnt/fraglet not mounted. Mount the fraglet repo as a read-only volume."
fi

if ! test -d /static_site ; then
  die "fatal : /static_site not mounted. Mount a writable volume for the output."
fi

if test -z "${UID:-}" ; then
  warn "No UID specified. Using current user's UID."
  export UID=$(id -u)
fi

if test -z "${GID:-}" ; then
  warn "No GID specified. Using current user's GID."
  export GID=$(id -g)
fi

echo "==> Running preprocessor..."
HELLOS_DIR=/mnt/100hellos \
FRAGLET_DIR=/mnt/fraglet \
OUTPUT_DIR=/app/src/content/languages \
METADATA_PATH=/app/languages-metadata.yml \
  node /app/scripts/preprocess.js

echo "==> Building Gatsby site..."
cd /app
npx gatsby build

echo "==> Copying output to /static_site..."
cp -r /app/public/* /static_site/
chown -R ${UID}:${GID} /static_site/

echo "==> Done."

exec "$@"
