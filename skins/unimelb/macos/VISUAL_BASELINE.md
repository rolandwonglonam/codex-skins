# UniMelb Codex 视觉基线

基线版本：`1.0.0-unimelb1`

## 固定规则

- 左侧栏和顶栏使用 Traditional Heritage Blue `#000F46`，文字和图标使用白色。
- 主内容区、聊天区、设置右侧和输入框保持浅色，文字使用 `#101828`。
- 文件卡片使用 `#001A57`，卡片文字和按钮使用白色。
- 白色卡片不强制使用白字。
- 置顶和归档按钮固定在标题右侧；标题保留按钮空间。
- “展开显示”在深色侧栏使用白字。
- 首页使用 Old Quad 实景图和官方 housed logo；问题标题使用白色。
- 设置页使用 Heritage Blue 左栏、官方 logo、浅色右栏和蓝色控件。
- 16ms 非重置调度、样式幂等写入和自变更过滤不得删除。

## 品牌资产

- `assets/unimelb-logo.svg`
- `assets/unimelb-logo--housed.svg`
- `assets/unimelb-old-quad.jpg`

内部仍保留 `codex-uq-*` 兼容选择器。它们用于在 UQ 与 UniMelb 版本之间切换时复用同一组页面节点，不能随意改名。
