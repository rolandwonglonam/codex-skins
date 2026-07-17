# Codex Skins

Roland 的 Codex Desktop macOS 皮肤仓库。

当前收录 2 套皮肤：

| 皮肤 | 配色 | 版本 | 源码 |
| --- | --- | --- | --- |
| UQ | UQ Purple `#51247A` | `1.1.1-uq25` | [`skins/uq/macos`](skins/uq/macos) |
| UniMelb | Traditional Heritage Blue `#000F46` | `1.0.0-unimelb1` | [`skins/unimelb/macos`](skins/unimelb/macos) |

## 下载

安装包放在 [Releases](../../releases/latest)：

- `Codex-UQ-Skin.zip`：解压后双击 `安装 Codex UQ Skin.command`
- `Codex-UniMelb-Skin.zip`：解压后双击 `Codex.app`。图标和名称会显示在 Finder 中

用户可以复制下面这句话发送给 macOS Codex，让 Codex 自动完成安装：

```text
请打开 https://github.com/rolandwonglonam/codex-skins，让我选择 UQ 或 UniMelb，然后从最新 Release 下载对应的 macOS 皮肤，完成解压、安装、自检和 Codex 重启；请直接操作，不要只给教程。
```

## 使用范围

- 面向 macOS Codex Desktop
- 不修改官方 `Codex.app` 或 `app.asar`
- 通过本机回环 CDP 加载主题
- UQ 和 UniMelb 的安装目录分开
- Codex 同一时间只加载一套皮肤。重新运行另一套安装器即可切换

## 本机测试

```bash
cd skins/uq/macos
./tests/run-tests.sh
```

```bash
cd skins/unimelb/macos
./tests/run-tests.sh
```

## 品牌资产

本仓库不是 OpenAI、The University of Queensland 或 The University of Melbourne 的官方项目。

学校 Logo 和校园图片的权利归各自权利人。来源记录见：

- [`skins/uq/macos/references/asset-provenance.md`](skins/uq/macos/references/asset-provenance.md)
- [`skins/unimelb/macos/references/asset-provenance.md`](skins/unimelb/macos/references/asset-provenance.md)

公开分发或商业使用前，需要按学校的品牌规则确认许可。
