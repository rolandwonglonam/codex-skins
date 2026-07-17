#!/bin/bash

set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd -P)/common-macos.sh"

PORT=9341
while [ "$#" -gt 0 ]; do
  case "$1" in
    --port) PORT="${2:-}"; shift 2 ;;
    *) fail "Unknown auto-inject argument: $1" ;;
  esac
done
case "$PORT" in ''|*[!0-9]*) fail "Invalid port: $PORT" ;; esac

discover_codex_app
NODE="$CODEX_BUNDLE/Contents/Resources/cua_node/bin/node"
[ -x "$NODE" ] || fail "Codex bundled Node.js was not found: $NODE"
export NODE
codex_is_running || exit 0

if verified_cdp_endpoint "$PORT"; then
  if [ -f "$STATE_PATH" ]; then
    injector_pid="$(state_field injectorPid 2>/dev/null || true)"
    if [ -n "$injector_pid" ] && /bin/kill -0 "$injector_pid" 2>/dev/null; then
      exit 0
    fi
  fi
  exec "$SCRIPT_DIR/start-dream-skin-macos.sh" --port "$PORT"
fi

# Codex was opened normally. Restart it once with the local debugging endpoint
# required by the runtime-only theme. The helper never launches Codex while it
# is closed, so a deliberate quit remains a quit.
exec "$SCRIPT_DIR/start-dream-skin-macos.sh" --port "$PORT" --restart-existing
