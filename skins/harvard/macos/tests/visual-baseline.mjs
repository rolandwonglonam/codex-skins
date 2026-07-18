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

if (version !== "1.0.1-harvard2") throw new Error(`Visual baseline version changed: ${version}`);
if (theme.id !== "harvard-codex-1" || theme.colors.highlight.toLowerCase() !== "#a51c30") {
  throw new Error("Harvard theme identity or Harvard Crimson changed");
}

requireText(css, "background: #a51c30 !important;", "Harvard Crimson navigation");
requireText(css, "background: #f7f3ee !important;", "light main surface");
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
requireText(css, "body div.app-shell-left-panel", "settings-only Crimson sidebar");
requireText(css, "#codex-uq-settings-logo", "settings Harvard logo");
requireText(renderer, "SETTINGS_LOGO_ID", "settings logo injection");
requireText(injector, '"harvard-university-signature.svg"', "official Harvard logo payload");
requireText(injector, '"harvard-veritas-shield.svg"', "Veritas shield payload");
if (!theme.quote.startsWith("VERITAS")) throw new Error("Harvard identity quote changed");

if (/#51247a|#3b1b55|#ffb81c/i.test(css)) {
  throw new Error("Visual baseline violation: UQ palette remains in Harvard CSS");
}
if (/#000f46|#001a57|#407ec9|#94b7e1/i.test(css)) {
  throw new Error("Visual baseline violation: UniMelb palette remains in Harvard CSS");
}

const broadDropdownContrast = /querySelectorAll\([^\n]*bg-token-dropdown-background[^\n]*\)[\s\S]{0,120}setInlineContrast\(card,\s*"#ffffff"\)/;
if (broadDropdownContrast.test(renderer)) {
  throw new Error("Visual baseline violation: global dropdown white-text rule returned");
}

console.log("PASS: Harvard Codex visual baseline 1.0.1-harvard2");
