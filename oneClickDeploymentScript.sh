#!/usr/bin/env bash
set -euo pipefail

public_base_url="${PUBLIC_BASE_URL:-http://42.123.114.169:8080}"

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  docker compose up -d --build
else
  command -v pnpm >/dev/null 2>&1 || npm install -g pnpm@10.24.0
  pnpm install --frozen-lockfile
  pnpm build
  mkdir -p .next/standalone/.next
  rm -rf .next/standalone/.next/static
  cp -r .next/static .next/standalone/.next/static
  pkill -f '/opt/worldcup/.next/standalone/server.js' || true
  (cd .next/standalone && PORT=8080 HOSTNAME=0.0.0.0 nohup node server.js >/tmp/worldcup-next.log 2>&1 &)
  sleep 5
fi
bash scripts/deploy/smoke-check.sh "${public_base_url}"
