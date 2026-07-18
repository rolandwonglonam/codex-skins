# Codex Harvard Skin

这是基于 UQ `1.1.1-uq25` 视觉基线制作的独立版本。

- 主色：Harvard Crimson `#A51C30`
- Logo：Harvard 官方网站使用的 Harvard University 签名和 Veritas 校徽
- 首页图片：Widener Library 正面柱廊实景图
- 内容区：浅色背景、深色文字
- 深色导航和文件卡片：白色文字

## 安装

发给其他人时，使用打包后的 `Codex Harvard Skin.zip`。解压后双击 `Codex.app`。第一次点击会安装并加载皮肤，以后点击会直接启动它。

如果 macOS 第一次拦截，右键 `Codex.app`，选择“打开”。应用使用本机临时签名，没有使用 Apple Developer ID 公证。

备用入口是 `安装 Codex Harvard Skin.command`。源码目录也可以运行：

```bash
./scripts/install-dream-skin-macos.sh
```

安装目录：`~/.codex/codex-harvard-skin-studio`

UQ 和 UniMelb 版本的文件不会被覆盖。Codex 同一时间只加载一个主题；安装 Harvard 版本后，自动加载入口会切到 Harvard。重新运行其他版本的安装器可以切回。

## 验证

```bash
./tests/run-tests.sh
./scripts/verify-dream-skin-macos.sh --screenshot "$HOME/Desktop/Codex Harvard Skin Verification.png"
```

## 品牌使用

这是本地预览。Logo 和校园图片的来源记录在 `references/asset-provenance.md`。Harvard 要求第三方使用其名称和标志前取得许可，所以这个版本暂不放入公开仓库。
