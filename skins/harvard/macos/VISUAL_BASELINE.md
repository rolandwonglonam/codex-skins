# Harvard Codex 视觉基线

基线版本：`1.0.1-harvard2`

## 固定规则

- 左侧栏和顶栏使用 Harvard Crimson `#A51C30`，文字和图标使用白色。
- 主内容区、聊天区、设置右侧和输入框保持浅色，文字使用 `#1e1e1e`。
- 文件卡片使用 `#7B1B2D`，卡片文字和按钮使用白色。
- 白色卡片不强制使用白字。
- 置顶和归档按钮固定在标题右侧；标题保留按钮空间。
- “展开显示”在深色侧栏使用白字。
- 首页使用 Widener Library 实景图和 Harvard University 官方签名；问题标题使用白色。
- 设置页使用 Harvard Crimson 左栏、官方签名、浅色右栏和 Crimson 控件。
- 16ms 非重置调度、样式幂等写入和自变更过滤不得删除。

## 品牌资产

- `assets/harvard-university-signature.svg`
- `assets/harvard-veritas-shield.svg`
- `assets/harvard-widener-library.jpg`

内部仍保留 `codex-uq-*` 兼容选择器。它们用于复用已经验证过的页面节点，不能随意改名。
