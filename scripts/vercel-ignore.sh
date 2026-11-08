#!/usr/bin/env bash
# Vercel ignoreCommand: exit 0 skips the build, 1 builds. Usage: vercel-ignore.sh <workspace>
# turbo-ignore compares against the branch's previous deployment. A branch's first push
# has none, and HEAD^ alone misses earlier commits on the branch, so compare against
# the merge base with main instead. Any git failure falls back to HEAD^.
set -u
ws="$1"
if [ -z "${VERCEL_GIT_PREVIOUS_SHA:-}" ]; then
  base=""
  if git fetch --quiet --depth=200 origin main 2>/dev/null; then
    base=$(git merge-base HEAD FETCH_HEAD 2>/dev/null || true)
  fi
  # On main itself the merge base is HEAD, which would compare nothing.
  if [ -z "$base" ] || [ "$base" = "$(git rev-parse HEAD)" ]; then base="HEAD^"; fi
  exec npx -y turbo-ignore@2.11.10 "$ws" --fallback="$base"
fi
exec npx -y turbo-ignore@2.11.10 "$ws"
