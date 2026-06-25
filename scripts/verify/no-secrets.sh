#!/usr/bin/env bash
set -euo pipefail

if git ls-files | grep -Eq '(^|/)deployServer\.md$'; then
  printf 'deployServer.md must not be tracked\n' >&2
  exit 1
fi

if git grep -nE 'root\+vm-| -p 32222|sshpass|SSHPASS' -- . ':!scripts/verify/no-secrets.sh' >/tmp/worldcup-secret-scan.txt; then
  printf 'Potential deployment secret found in tracked content\n' >&2
  cat /tmp/worldcup-secret-scan.txt >&2
  exit 1
fi

printf 'No tracked deployment secrets detected\n'
