#!/bin/bash

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
VERSION="$(/usr/bin/tr -d '[:space:]' < "$ROOT/VERSION")"
RELEASE_DIR="$ROOT/release"
ARCHIVE="$RELEASE_DIR/codex-harvard-skin-studio-v$VERSION.zip"
TMP="$(/usr/bin/mktemp -d /tmp/codex-harvard-skin-release.XXXXXX)"
trap '/bin/rm -rf "$TMP"' EXIT

if [ "${1:-}" != "--skip-tests" ]; then "$ROOT/tests/run-tests.sh"; fi

/bin/mkdir -p "$TMP/codex-harvard-skin-studio" "$RELEASE_DIR"
/usr/bin/rsync -a \
  --exclude '.git/' \
  --exclude '.DS_Store' \
  --exclude 'release/' \
  "$ROOT/" "$TMP/codex-harvard-skin-studio/"
/bin/chmod 755 "$TMP/codex-harvard-skin-studio"/*.command
/bin/chmod 755 "$TMP/codex-harvard-skin-studio"/scripts/*.sh "$TMP/codex-harvard-skin-studio"/tests/*.sh
/bin/rm -f "$ARCHIVE"
/usr/bin/ditto -c -k --keepParent "$TMP/codex-harvard-skin-studio" "$ARCHIVE"
SHA256="$(/usr/bin/shasum -a 256 "$ARCHIVE" | /usr/bin/awk '{print $1}')"
/usr/bin/printf '%s  %s\n' "$SHA256" "$(basename "$ARCHIVE")" > "$RELEASE_DIR/SHA256SUMS.txt"
/usr/bin/printf 'Created %s\nSHA-256 %s\n' "$ARCHIVE" "$SHA256"
