# Changelog

## 1.1.1-uq25 — 2026-07-17

- 相同的 class 状态不再重复写入，停止主题自身触发的更新循环。

## 1.1.1-uq24 — 2026-07-17

- 过滤主题自身产生的 DOM 变化，避免下一帧更新形成循环。
- 相同的内联颜色不重复写入。

## 1.1.1-uq23 — 2026-07-17

- 页面变化固定在下一帧处理，不再反复重置 180ms 计时。
- 清理旧内联颜色只在注入时执行一次，避免持续触发布局更新。

## 1.1.1-uq22 — 2026-07-17

- 自动加载服务固定使用 Codex 自带 Node，避免重启检查返回错误。
- 视觉基线保持 uq21 的页面样式不变。

## 1.1.1-uq21 — 2026-07-17

- 设置页左栏改为 UQ Purple，并加入白色 UQ Logo。
- 设置页右侧保持浅色，开关和链接使用 UQ Purple。

## 1.1.1-uq20 — 2026-07-17

- 文件资源卡片通过专用 CSS 直接显示紫底白字，取消切换延迟。
- 文件卡片规则不再影响白底菜单和输入框。

## 1.1.1-uq19 — 2026-07-17

- 首页问题标题全部改为白色。

## 1.1.1-uq18 — 2026-07-17

- 白底菜单和输入框恢复深色文字。
- 白色文字只应用到文件卡片的深色区域。

## 1.1.1-uq17 — 2026-07-17

- Restore scheduled-task suggestion rows to white cards with dark text.

## 1.1.1-uq16 — 2026-07-17

- Preserve inline white text on the transparent sidebar expand control.

## 1.1.1-uq15 — 2026-07-17

- Apply inline-important white contrast to dark buttons and their icons.
- Apply the same high-priority white color to the sidebar expand control.

## 1.1.1-uq14 — 2026-07-17

- Reserve a fixed sidebar action rail for pin and archive controls.
- Mark the sidebar expand label and render it in white.
- Force white text and icons on dark composer and dark-classified buttons.

## 1.1.1-uq13 — 2026-07-17

- Force white hero text and a white project control over the campus photograph.
- Remove the purple logo badge and render the official reversed wordmark directly over the image.

## 1.1.1-uq12 — 2026-07-17

- Add a per-user LaunchAgent that reapplies the UQ theme after Codex is opened normally.
- Keep deliberate Codex quits closed; the helper only acts when Codex is already running.
- Remove the automatic helper when restoring the official appearance.

## 1.1.1-uq11 — 2026-07-16

- Style the visible task resource-card container as a light surface.
- Reserve sidebar title space for pin and archive controls.
- Restore contrast for the sidebar expand label.

## 1.1.1-uq10 — 2026-07-16

- Raise file-row light-surface rules above the earlier task-surface override.

## 1.1.1-uq9 — 2026-07-16

- Change file summary panels from dark purple to white reading surfaces.
- Use dark text and light dividers for file names, metadata, and open controls.

## 1.1.1-uq8 — 2026-07-16

- Recognize Codex utility pages that do not include the chat composer.
- Allow live verification on Plugins, Sites, and Scheduled pages.

## 1.1.1-uq7 — 2026-07-16

- Use light surfaces for Sites, Plugins search areas, and scheduled-task cards.
- Reserve UQ Purple for the sidebar, top bar, selected states, and buttons.

## 1.1.1-uq6 — 2026-07-16

- Detect dark and light component surfaces and assign readable text automatically.
- Keep white modal surfaces dark-text while nested purple buttons use white text.

## 1.1.1-uq5 — 2026-07-16

- Remove the native pale overlay inside the sidebar so UQ Purple remains solid.

## 1.1.1-uq4 — 2026-07-16

### 阅读区和侧栏修正

- 保留 ChatGPT Work 原文字样，只在旁边放小校徽
- 侧栏和顶栏使用实色 UQ Purple
- 任务正文和输入框改为不透明浅色底和深色字

---

## 1.1.1-uq3 — 2026-07-16

### UQ Dashboard 界面

- 左侧栏改为不透明 UQ Purple，用白色 UQ Logo 覆盖原生品牌文字
- 任务页移除校园图背景，改为不透明深紫底
- 用户输入、助手输出和编辑器改为高对比紫色面板
- 主页保留 Great Court 横幅，其他区域使用 UQ Dashboard 式紫色层级

---

## 1.1.1-uq2 — 2026-07-16

### 校园实景与 Logo

- 默认背景改为 UQ 官方 St Lucia 页面使用的 Great Court 实景图
- 完整反白 UQ Logo 固定显示在主页横幅右上角
- 顶部区域继续按深浅模式切换 UQ Logo

---

## 1.1.1-uq1 — 2026-07-16

### UQ 配色版

- 加入 UQ Purple `#51247A`、`#962A8B` 和深浅两套界面配色
- 加入原创校园建筑几何背景和 UQ 官方深浅两版 Logo
- 桌面入口改为 `Codex UQ Skin`
- 保留原项目的安装、验证、暂停和恢复流程

---

## 1.1.1 — 2026-07-16

### 修复

- 不再用 `launchctl submit` 托管带调试口的 Codex：退出 SwiftBar / 关掉 Codex 后不应再被 launchd 自动拉起
- 暂停与完全恢复时清理 `com.openai.codex-dream-skin-studio.app` 作业

---

## 1.1.0 — 2026-07-16

### 新增

- SwiftBar 菜单栏入口（`Install Menu Bar.command`）：应用 / 暂停 / 换图 / 切换已保存主题 / 从图片文件夹加载 / 完全恢复
- 主题库（`themes/`）与图片投放目录（`images/`）动态加载，不再把 README 图库合成图当背景素材
- 按 Codex 应用浅色 / 深色自动切换皮肤壳（`data-dream-shell`）

### 改进

- CDP 已就绪时热切换主题（重启 injector + 短时注入），换图更快
- 注入校验放宽（项目选择器等可选），避免误杀已生效皮肤
- 注入守护优先 `nohup`；暂停状态与路径大小写下停止逻辑更稳
- 安装时不再强制 `appearanceTheme=dark`，只备份桌面外观相关键，便于恢复与自动适配

### 视觉

- 以原版暗色 portal CSS 为结构底，叠加 light 壳与更薄横幅遮罩，减轻「换图看不清」
- 示例纯横幅：`docs/images/banner-arina-hashimoto-pure-no-ui.png`（无人机 UI 合成）

### 说明

- `docs/images/gallery/` 仅为效果预览，不要当 `theme` 背景导入

---

## 1.0.0 — 2026-07-15

- 发布 macOS 通用主题制作器，而不是固定角色皮肤。
- 加入 Finder 选图、自动 JPEG 转换、主题命名和高级配色参数。
- 主页使用独立横幅，任务页使用背景与磨砂层，完整保留原生交互。
- 改为复用并验证 Codex 官方签名 Node.js，不再附带大型运行时或依赖全局 Node。
- 增加独立安装目录、桌面启动/定制/验证/恢复入口。
- 增加官方签名、CDP 端口归属、PID 身份、刷新重注入和真实 DOM 自检。
- 增加原子配置备份、精确恢复、静态测试、安装恢复循环和发布打包脚本。
- 清理固定角色内部命名；传送门主题仅作为可替换示例素材。
- 开源树：示例横幅改为无角色抽象几何图；验收截图不入库；补充 NOTICE / README 商标与安全边界说明。
