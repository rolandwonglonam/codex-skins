# Codex UniMelb Skin

这是基于 UQ `1.1.1-uq25` 视觉基线制作的独立版本。

- 主色：Traditional Heritage Blue `#000F46`
- Logo：University of Melbourne 官方 Vertical Housed SVG
- 首页图片：University of Melbourne 官方网站中的 Old Quad 实景图
- 内容区：浅色背景、深色文字
- 深色导航和文件卡片：白色文字

## 安装

发给其他人时，使用打包后的 `Codex UniMelb Skin.zip`。解压后双击 `Codex.app`。第一次点击会安装并加载皮肤，以后点击会直接启动它。

如果 macOS 第一次拦截，右键 `Codex.app`，选择“打开”。应用使用本机临时签名，没有使用 Apple Developer ID 公证。

备用入口是 `安装 Codex UniMelb Skin.command`。源码目录也可以运行：

```bash
./scripts/install-dream-skin-macos.sh
```

安装目录：`~/.codex/codex-unimelb-skin-studio`

UQ 版本的文件不会被覆盖。Codex 同一时间只加载一个主题；安装 UniMelb 版本后，自动加载入口会切到 UniMelb。重新运行 UQ 安装器可以切回 UQ。

## 验证

```bash
./tests/run-tests.sh
./scripts/verify-dream-skin-macos.sh --screenshot "$HOME/Desktop/Codex UniMelb Skin Verification.png"
```

## 品牌使用

这是本地预览。University of Melbourne Logo 和校园图片的来源记录在 `references/asset-provenance.md`。公开发布前需要确认学校许可。
