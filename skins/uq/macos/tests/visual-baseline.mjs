import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "assets", "dream-skin.css"), "utf8");
const renderer = fs.readFileSync(path.join(root, "assets", "renderer-inject.js"), "utf8");
const version = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim();

const requireText = (source, text, label) => {
  if (!source.includes(text)) throw new Error(`Visual baseline missing: ${label}`);
};

if (version !== "1.1.1-uq25") throw new Error(`Visual baseline version changed: ${version}`);

requireText(css, "background: #51247a !important;", "UQ Purple navigation");
requireText(css, "background: #f3eef6 !important;", "light main surface");
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
requireText(css, "#codex-uq-settings-logo", "settings UQ logo");
requireText(renderer, "SETTINGS_LOGO_ID", "settings logo injection");
requireText(renderer, "what should we work on", "new home prompt detection");
requireText(css, '[role="main"] .composer-surface-chrome :is(button, [role="button"]) *', "new home dark-control contrast");
requireText(css, '.group\\/project-selector > button *', "project selector descendant contrast");
requireText(css, 'div:has(> .relative > .composer-surface-chrome)', "home composer footer contrast");
requireText(css, '[aria-label="Pin chat"]', "English pin action spacing");
requireText(css, '[aria-label="Archive chat"]', "English archive action spacing");
requireText(css, 'padding-right: 64px !important;', "sidebar action rail spacing");
requireText(renderer, '[class*="_homeUtilityBar_"] button', "immediate home utility contrast");
requireText(css, '[class*="_homeUtilityBar_"] :is(button, [role="button"]) *', "static home utility contrast");
requireText(renderer, '"Show more", "Show less"', "English sidebar expansion labels");
requireText(css, 'button[class*="text-token-input-placeholder-foreground"]', "immediate sidebar expansion contrast");

const broadDropdownContrast = /querySelectorAll\([^\n]*bg-token-dropdown-background[^\n]*\)[\s\S]{0,120}setInlineContrast\(card,\s*"#ffffff"\)/;
if (broadDropdownContrast.test(renderer)) {
  throw new Error("Visual baseline violation: global dropdown white-text rule returned");
}

console.log("PASS: UQ Codex visual baseline 1.1.1-uq25");
