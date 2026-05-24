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

REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

echo "==> Syncing project to ${REMOTE}:${DEPLOY_PATH}"
rsync -avz --delete \
  --exclude node_modules \
  --exclude dist \
  --exclude .git \
  --exclude .env \
  ./ "${REMOTE}:${DEPLOY_PATH}/"

echo "==> Copying .env to remote"
scp .env "${REMOTE}:${DEPLOY_PATH}/.env"

echo "==> Building and starting containers on remote"
ssh "${REMOTE}" "cd ${DEPLOY_PATH} && docker compose up -d --build"

echo "==> Deploy complete"
