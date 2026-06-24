#!/usr/bin/env bash
set -euo pipefail

status=0
while IFS= read -r file; do
  count=$(awk '!/^[[:space:]]*$/ && !/^[[:space:]]*(\/\/|#|--)/' "${file}" | wc -l | tr -d ' ')
  if [ "${count}" -gt 250 ]; then
    printf '%s has %s pure LOC\n' "${file}" "${count}" >&2
    status=1
  fi
done < <(git ls-files '*.ts' '*.tsx')

exit "${status}"
