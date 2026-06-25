#!/usr/bin/env bash
set -euo pipefail

public_base_url="${PUBLIC_BASE_URL:-http://47.95.124.205}"
app_port="${APP_PORT:-80}"

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  docker compose up -d --build
else
  command -v pnpm >/dev/null 2>&1 || npm install -g pnpm@10.24.0
  pnpm install --frozen-lockfile
  pnpm build
  mkdir -p .next/standalone/.next
  rm -rf .next/standalone/.next/static
  cp -r .next/static .next/standalone/.next/static
  if [ -f /tmp/worldcup-next.pid ]; then
    kill "$(cat /tmp/worldcup-next.pid)" 2>/dev/null || true
    rm -f /tmp/worldcup-next.pid
  fi
  (cd .next/standalone && PORT="${app_port}" HOSTNAME=0.0.0.0 nohup node server.js >/tmp/worldcup-next.log 2>&1 & echo $! >/tmp/worldcup-next.pid)
  sleep 5
fi
bash scripts/deploy/smoke-check.sh "${public_base_url}"
