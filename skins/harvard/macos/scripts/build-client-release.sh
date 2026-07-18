#!/bin/bash

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
OUTPUT="${1:-$HOME/Desktop/Codex Harvard Skin.zip}"
TMP="$(/usr/bin/mktemp -d /tmp/codex-harvard-client.XXXXXX)"
CLIENT_ROOT="$TMP/Codex Harvard Skin"
APP="$CLIENT_ROOT/Codex.app"
APP_CONTENTS="$APP/Contents"
ENGINE="$APP_CONTENTS/Resources/engine"
trap '/bin/rm -rf "$TMP"' EXIT

"$ROOT/tests/run-tests.sh"
/bin/mkdir -p "$APP_CONTENTS/MacOS" "$APP_CONTENTS/Resources" "$ENGINE"
/usr/bin/rsync -a \
  --exclude '.git/' \
  --exclude '.DS_Store' \
  --exclude 'assets/AppIcon.icns' \
  --exclude 'client-delivery/' \
  --exclude 'launcher/' \
  --exclude 'release/' \
  --exclude 'runtime/' \
  "$ROOT/" "$ENGINE/"
/bin/cp "$ROOT/launcher/Info.plist" "$APP_CONTENTS/Info.plist"
/bin/cp "$ROOT/launcher/launcher" "$APP_CONTENTS/MacOS/launcher"
/bin/cp "$ROOT/assets/AppIcon.icns" "$APP_CONTENTS/Resources/AppIcon.icns"

/usr/bin/printf '%s\n' \
  '#!/bin/bash' \
  'set -euo pipefail' \
  'ROOT="$(cd "$(dirname "$0")" && pwd -P)"' \
  'exec "$ROOT/Codex.app/Contents/Resources/engine/scripts/install-dream-skin-macos.sh"' \
  > "$CLIENT_ROOT/安装 Codex Harvard Skin.command"

/usr/bin/printf '%s\n' \
  'Codex Harvard Skin 1.0.1-harvard2' \
  '' \
  '双击“Codex.app”即可安装并加载皮肤。以后再点它，会直接启动 Harvard 皮肤。' \
  '' \
  '如果 macOS 第一次拦截，请右键“Codex.app”，选择“打开”。' \
  '' \
  '备用方式：双击“安装 Codex Harvard Skin.command”。' \
  '' \
  'Codex.app 内含完整运行引擎。不要拆开应用内容。' \
  > "$CLIENT_ROOT/使用说明.txt"

/bin/cp "$ROOT/CLIENT_DEPLOY_PROMPT.md" "$CLIENT_ROOT/给 Codex 的部署提示词.md"
/bin/chmod 755 "$CLIENT_ROOT/安装 Codex Harvard Skin.command"
/bin/chmod 755 "$APP_CONTENTS/MacOS/launcher"
/bin/chmod 755 "$ENGINE"/*.command "$ENGINE"/scripts/*.sh "$ENGINE"/tests/*.sh
/usr/bin/plutil -lint "$APP_CONTENTS/Info.plist" >/dev/null
"$APP_CONTENTS/MacOS/launcher" --self-check >/dev/null
/usr/bin/xattr -cr "$CLIENT_ROOT"
/usr/bin/find "$CLIENT_ROOT" -type f \( -name '.DS_Store' -o -name '._*' \) -delete
/usr/bin/codesign --force --deep --sign - "$APP" >/dev/null
/usr/bin/codesign --verify --deep --strict "$APP"
/bin/mkdir -p "$(dirname "$OUTPUT")"
/bin/rm -f "$OUTPUT"
COPYFILE_DISABLE=1 /usr/bin/ditto -c -k --keepParent --norsrc --noextattr "$CLIENT_ROOT" "$OUTPUT"
SHA256="$(/usr/bin/shasum -a 256 "$OUTPUT" | /usr/bin/awk '{print $1}')"
/usr/bin/printf 'Created %s\nSHA-256 %s\n' "$OUTPUT" "$SHA256"
