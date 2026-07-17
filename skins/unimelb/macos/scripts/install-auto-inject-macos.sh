#!/bin/bash

set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd -P)/common-macos.sh"

PORT=9341
REMOVE="false"
while [ "$#" -gt 0 ]; do
  case "$1" in
    --port) PORT="${2:-}"; shift 2 ;;
    --remove) REMOVE="true"; shift ;;
    *) fail "Unknown auto-inject installer argument: $1" ;;
  esac
done

uid="$(/usr/bin/id -u)"
domain="gui/$uid"
/bin/mkdir -p "$HOME/Library/LaunchAgents"

/bin/launchctl bootout "$domain/$AUTO_INJECT_JOB_LABEL" >/dev/null 2>&1 || true
if [ "$REMOVE" = "true" ]; then
  /bin/rm -f "$AUTO_INJECT_PLIST"
  exit 0
fi

temporary="$AUTO_INJECT_PLIST.tmp.$$"
/bin/rm -f "$temporary"
/usr/bin/plutil -create xml1 "$temporary"
/usr/libexec/PlistBuddy -c "Add :Label string $AUTO_INJECT_JOB_LABEL" "$temporary"
/usr/libexec/PlistBuddy -c "Add :ProgramArguments array" "$temporary"
/usr/libexec/PlistBuddy -c "Add :ProgramArguments:0 string /bin/bash" "$temporary"
/usr/libexec/PlistBuddy -c "Add :ProgramArguments:1 string $SCRIPT_DIR/auto-inject-macos.sh" "$temporary"
/usr/libexec/PlistBuddy -c "Add :ProgramArguments:2 string --port" "$temporary"
/usr/libexec/PlistBuddy -c "Add :ProgramArguments:3 string $PORT" "$temporary"
/usr/libexec/PlistBuddy -c "Add :RunAtLoad bool true" "$temporary"
/usr/libexec/PlistBuddy -c "Add :StartInterval integer 3" "$temporary"
/usr/libexec/PlistBuddy -c "Add :ProcessType string Background" "$temporary"
/usr/libexec/PlistBuddy -c "Add :StandardOutPath string $AUTO_INJECT_LOG" "$temporary"
/usr/libexec/PlistBuddy -c "Add :StandardErrorPath string $AUTO_INJECT_ERROR_LOG" "$temporary"
/bin/chmod 600 "$temporary"
/bin/mv "$temporary" "$AUTO_INJECT_PLIST"
/bin/launchctl bootstrap "$domain" "$AUTO_INJECT_PLIST"
/bin/launchctl enable "$domain/$AUTO_INJECT_JOB_LABEL" >/dev/null 2>&1 || true
/bin/launchctl kickstart -k "$domain/$AUTO_INJECT_JOB_LABEL" >/dev/null 2>&1 || true
