import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "assets", "dream-skin.css"), "utf8");
const renderer = fs.readFileSync(path.join(root, "assets", "renderer-inject.js"), "utf8");
const injector = fs.readFileSync(path.join(root, "scripts", "injector.mjs"), "utf8");
const theme = JSON.parse(fs.readFileSync(path.join(root, "assets", "theme.json"), "utf8"));
const version = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim();

const requireText = (source, text, label) => {
  if (!source.includes(text)) throw new Error(`Visual baseline missing: ${label}`);
};

if (version !== "1.0.0-unimelb1") throw new Error(`Visual baseline version changed: ${version}`);
if (theme.id !== "unimelb-codex-1" || theme.colors.highlight.toLowerCase() !== "#000f46") {
  throw new Error("UniMelb theme identity or Heritage Blue changed");
}

requireText(css, "background: #000f46 !important;", "Heritage Blue navigation");
requireText(css, "background: #f4f6fa !important;", "light main surface");
requireText(css, ".composer-surface-chrome", "composer rules");
requireText(css, "background: #ffffff !important;", "white reading surfaces");
requireText(css, ".codex-uq-dark-surface *", "white text on dark surfaces");
requireText(css, ".codex-uq-light-surface *", "dark text on light surfaces");
requireText(css, '.dream-skin-home [data-feature="game-source"] *', "white home title descendants");
requireText(css, 'button[aria-label="置顶任务"]', "fixed pin action");
requireText(css, 'button[aria-label="归档任务"]', "fixed archive action");
requireText(renderer, 'setInlineContrast(heroTitle, "#ffffff")', "home title inline contrast");
requireText(css, 'div[class*="thread-resource-card-row-padding-x"] *', "immediate resource-card contrast");
requireText(renderer, 'clearInlineContrast(document.body)', "stale contrast cleanup");
requireText(renderer, "if (scheduler.timeout) return", "non-resetting render scheduler");
requireText(renderer, "}, 16);", "next-frame render response");
requireText(renderer, "isThemeManagedMutation", "self-mutation filter");
requireText(renderer, 'getPropertyPriority("color") !== "important"', "idempotent contrast write");
requireText(renderer, '!node.classList.contains(INLINE_CONTRAST_CLASS)', "idempotent contrast class");
requireText(renderer, 'element.classList.contains(DARK_SURFACE_CLASS) !== dark', "idempotent dark-surface class");
requireText(css, "body div.app-shell-left-panel", "settings-only purple sidebar");
requireText(css, "#codex-uq-settings-logo", "settings UniMelb logo");
requireText(renderer, "SETTINGS_LOGO_ID", "settings logo injection");
requireText(injector, '"unimelb-logo.svg"', "official UniMelb logo payload");
requireText(injector, '"unimelb-logo--housed.svg"', "housed UniMelb logo payload");

if (/#51247a|#3b1b55|#ffb81c/i.test(css)) {
  throw new Error("Visual baseline violation: UQ palette remains in UniMelb CSS");
}

const broadDropdownContrast = /querySelectorAll\([^\n]*bg-token-dropdown-background[^\n]*\)[\s\S]{0,120}setInlineContrast\(card,\s*"#ffffff"\)/;
if (broadDropdownContrast.test(renderer)) {
  throw new Error("Visual baseline violation: global dropdown white-text rule returned");
}

console.log("PASS: UniMelb Codex visual baseline 1.0.0-unimelb1");
