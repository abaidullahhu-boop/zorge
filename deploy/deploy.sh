#!/usr/bin/env bash
# Build locally and upload dist/ to the VPS as a new release, then flip the
# `current` symlink so visitors never see a half-uploaded site. Unchanged files
# are hard-linked from the previous release, so only new/changed media uploads.
#
#   DEPLOY_HOST=deploy@<server-ip> npm run deploy
set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST, e.g. DEPLOY_HOST=deploy@203.0.113.10}"
APP_DIR="${APP_DIR:-/var/www/dayim}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
RELEASE="$(date +%Y%m%d%H%M%S)"

cd "$(dirname "$0")/.."

# Vite inlines VITE_* at build time; without them the forms are disabled.
if ! cat .env .env.local .env.production .env.production.local 2>/dev/null | grep -q '^VITE_'; then
  echo "warning: no VITE_* variables in .env files; booking and career forms will be disabled" >&2
fi

npm run build

PREV="$(ssh "$DEPLOY_HOST" "readlink -e '$APP_DIR/current' || true")"
rsync -az --info=progress2 ${PREV:+--link-dest="$PREV"} dist/ "$DEPLOY_HOST:$APP_DIR/releases/$RELEASE/"

ssh "$DEPLOY_HOST" bash -s -- "$APP_DIR" "$RELEASE" "$KEEP_RELEASES" <<'EOF'
set -euo pipefail
app_dir=$1 release=$2 keep=$3
ln -sfn "$app_dir/releases/$release" "$app_dir/current.tmp"
mv -Tf "$app_dir/current.tmp" "$app_dir/current"
cd "$app_dir/releases"
ls -1 | sort -r | tail -n +$((keep + 1)) | xargs -r rm -rf
EOF

echo "Deployed release $RELEASE to $DEPLOY_HOST"
