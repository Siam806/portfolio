#!/usr/bin/env bash
set -euo pipefail

# Load environment variables from .env if present
if [ -f .env ]; then
  set -a
  # shellcheck source=/dev/null
  . ./.env
  set +a
fi

: "${DEPLOY_HOST:?DEPLOY_HOST is not set}"
: "${DEPLOY_USER:?DEPLOY_USER is not set}"
: "${DEPLOY_PATH:?DEPLOY_PATH is not set}"

echo "==> Installing dependencies"
npm ci

echo "==> Building site"
npm run build

echo "==> Deploying to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
rsync -avz --delete dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"

echo "==> Deploy complete"
