((cssText, artDataUrl, logoLightDataUrl, logoDarkDataUrl, themeConfig) => {
  const STATE_KEY = "__CODEX_DREAM_SKIN_STATE__";
  const DISABLED_KEY = "__CODEX_DREAM_SKIN_DISABLED__";
  const STYLE_ID = "codex-dream-skin-style";
  const CHROME_ID = "codex-dream-skin-chrome";
  const HERO_LOGO_ID = "codex-uq-hero-logo";
  const SIDEBAR_BRAND_ID = "codex-uq-sidebar-brand";
  const SETTINGS_LOGO_ID = "codex-uq-settings-logo";
  const DARK_SURFACE_CLASS = "codex-uq-dark-surface";
  const LIGHT_SURFACE_CLASS = "codex-uq-light-surface";
  const INLINE_CONTRAST_CLASS = "codex-uq-inline-contrast";
  const SHELL_ATTR = "data-dream-shell";
  const VERSION = __DREAM_SKIN_VERSION_JSON__;
  const THEME = themeConfig && typeof themeConfig === "object" ? themeConfig : {};
  const THEME_VARIABLES = [
    "--ds-bg", "--ds-panel", "--ds-panel-2", "--ds-green", "--ds-lime",
    "--ds-cyan", "--ds-purple", "--ds-text", "--ds-muted", "--ds-line",
    "--dream-skin-name", "--dream-skin-tagline", "--dream-skin-project-prefix",
    "--dream-skin-project-label",
  ];
  window[DISABLED_KEY] = false;

  const previous = window[STATE_KEY];
  if (previous?.observer) previous.observer.disconnect();
  if (previous?.timer) clearInterval(previous.timer);
  if (previous?.scheduler?.timeout) clearTimeout(previous.scheduler.timeout);
  if (previous?.resizeHandler) window.removeEventListener("resize", previous.resizeHandler);
  if (previous?.mediaHandler && previous?.mediaQuery) {
    try { previous.mediaQuery.removeEventListener("change", previous.mediaHandler); } catch {}
  }
  if (previous?.artUrl) URL.revokeObjectURL(previous.artUrl);

  const artUrl = (() => {
    const comma = artDataUrl.indexOf(",");
    const mime = /^data:([^;,]+)/.exec(artDataUrl)?.[1] || "image/png";
    const binary = atob(artDataUrl.slice(comma + 1));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  })();

  const cssString = (value) => JSON.stringify(String(value ?? ""));

  const parseRgb = (value) => {
    if (!value || value === "transparent") return null;
    const m = String(value).match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (!m) return null;
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
  };

  const luminance = ({ r, g, b }) => {
    const lin = [r, g, b].map((c) => {
      const x = c / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };

  /** Detect Codex app light/dark shell for CSS branching. */
  const detectShellMode = () => {
    const root = document.documentElement;
    const body = document.body;
    const cls = `${root.className || ""} ${body?.className || ""}`.toLowerCase();

    if (/\b(dark|theme-dark|appearance-dark)\b/.test(cls)) return "dark";
    if (/\b(light|theme-light|appearance-light)\b/.test(cls)) return "light";

    const dataTheme = (
      root.getAttribute("data-theme") ||
      root.getAttribute("data-appearance") ||
      root.getAttribute("data-color-mode") ||
      body?.getAttribute("data-theme") ||
      body?.getAttribute("data-appearance") ||
      ""
    ).toLowerCase();
    if (dataTheme.includes("dark")) return "dark";
    if (dataTheme.includes("light")) return "light";

    // Radios in profile menu (if present in DOM)
    const checked = document.querySelector('input[name="appearance-theme"]:checked');
    if (checked) {
      const label = (checked.getAttribute("aria-label") || checked.value || "").toLowerCase();
      if (label.includes("暗") || label.includes("dark")) return "dark";
      if (label.includes("浅") || label.includes("light")) return "light";
      if (label.includes("系统") || label.includes("system")) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    }

    try {
      const cs = getComputedStyle(root).colorScheme || "";
      if (cs.includes("dark") && !cs.includes("light")) return "dark";
      if (cs.includes("light") && !cs.includes("dark")) return "light";
    } catch {}

    // Background luminance of main surfaces
    const samples = [
      body,
      document.querySelector("main.main-surface"),
      document.querySelector("aside.app-shell-left-panel"),
    ].filter(Boolean);
    let votesLight = 0;
    let votesDark = 0;
    for (const el of samples) {
      try {
        const rgb = parseRgb(getComputedStyle(el).backgroundColor);
        if (!rgb) continue;
        const L = luminance(rgb);
        if (L >= 0.55) votesLight += 1;
        else if (L <= 0.25) votesDark += 1;
      } catch {}
    }
    if (votesLight > votesDark) return "light";
    if (votesDark > votesLight) return "dark";

    try {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch {}
    return "light";
  };

  const applyTheme = (root, shell) => {
    const colors = THEME.colors || {};
    const accent = colors.accent || (shell === "light" ? "#e25563" : "#7cff46");
    const accentAlt = colors.accentAlt || accent;
    const secondary = colors.secondary || (shell === "light" ? "#f3a8af" : "#36d7e8");
    const highlight = colors.highlight || (shell === "light" ? "#c93d4c" : "#642a8c");

    let variables;
    if (shell === "light") {
      // Structural tokens stay light so banners stay readable; accents follow theme.
      variables = {
        "--ds-bg": "#f7f4f8",
        "--ds-panel": "#ffffff",
        "--ds-panel-2": "#f2ecf4",
        "--ds-green": accent,
        "--ds-lime": accentAlt,
        "--ds-cyan": secondary,
        "--ds-purple": highlight,
        "--ds-text": "#22172a",
        "--ds-muted": "#6b5a73",
        "--ds-line": colors.line || "rgba(81, 36, 122, .18)",
      };
    } else {
      variables = {
        "--ds-bg": colors.background || "#071116",
        "--ds-panel": colors.panel || "#0b1a20",
        "--ds-panel-2": colors.panelAlt || "#10272c",
        "--ds-green": accent,
        "--ds-lime": accentAlt,
        "--ds-cyan": secondary,
        "--ds-purple": highlight,
        "--ds-text": colors.text || "#e9fff1",
        "--ds-muted": colors.muted || "#9ebdb3",
        "--ds-line": colors.line || "rgba(124, 255, 70, .28)",
      };
    }

    for (const [name, value] of Object.entries(variables)) {
      if (typeof value === "string" && value) root.style.setProperty(name, value);
    }
    root.style.setProperty("--dream-skin-name", cssString(THEME.name || "Codex Dream Skin"));
    root.style.setProperty("--dream-skin-tagline", cssString(THEME.tagline || "Make something wonderful."));
    root.style.setProperty("--dream-skin-project-prefix", cssString(THEME.projectPrefix || "选择项目 · "));
    root.style.setProperty("--dream-skin-project-label", cssString(THEME.projectLabel || "◉  选择项目"));
  };

  const existingStyle = document.getElementById(STYLE_ID);
  if (existingStyle) {
    existingStyle.textContent = cssText;
    existingStyle.dataset.dreamSkinVersion = VERSION;
  }

  const setInlineContrast = (element, color) => {
    if (!element) return;
    for (const node of [element, ...element.querySelectorAll("*")]) {
      if (!node.style) continue;
      if (node.style.getPropertyValue("color") !== color || node.style.getPropertyPriority("color") !== "important") {
        node.style.setProperty("color", color, "important");
      }
      if (node.classList && !node.classList.contains(INLINE_CONTRAST_CLASS)) {
        node.classList.add(INLINE_CONTRAST_CLASS);
      }
    }
  };

  const clearInlineContrast = (element) => {
    if (!element) return;
    for (const node of [element, ...element.querySelectorAll(`.${INLINE_CONTRAST_CLASS}`)]) {
      if (!node.classList?.contains(INLINE_CONTRAST_CLASS)) continue;
      node.style.removeProperty("color");
      node.classList.remove(INLINE_CONTRAST_CLASS);
    }
  };

  const syncSurfaceContrast = () => {
    const candidates = document.querySelectorAll([
      "aside", "header", "main", "section", "article", "button",
      '[role="button"]', '[role="dialog"]', '[class*="bg-"]',
      '[class*="background"]', '[class*="surface"]', '[style*="background"]',
    ].join(","));
    for (const element of candidates) {
      const background = getComputedStyle(element).backgroundColor;
      const match = background.match(/^rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);
      if (!match) continue;
      const alpha = match[4] == null ? 1 : Number(match[4]);
      const luminance = .2126 * Number(match[1]) + .7152 * Number(match[2]) + .0722 * Number(match[3]);
      const dark = alpha >= .65 && luminance < 112;
      const light = alpha >= .65 && luminance > 205;
      if (element.classList.contains(DARK_SURFACE_CLASS) !== dark) {
        element.classList.toggle(DARK_SURFACE_CLASS, dark);
      }
      if (element.classList.contains(LIGHT_SURFACE_CLASS) !== light) {
        element.classList.toggle(LIGHT_SURFACE_CLASS, light);
      }
      if (element.matches("button, [role='button']")) {
        if (dark || element.classList.contains("codex-uq-sidebar-expand-label")) {
          setInlineContrast(element, "#ffffff");
        }
        else clearInlineContrast(element);
      }
    }
  };

  const ensure = () => {
    if (window[DISABLED_KEY]) return;
    const root = document.documentElement;
    if (!root) return;
    const shell = detectShellMode();

    const settingsSidebar = [...document.querySelectorAll("div.app-shell-left-panel")].find((node) =>
      node.querySelector('input[role="searchbox"]')) || null;
    let settingsLogo = document.getElementById(SETTINGS_LOGO_ID);
    if (!settingsSidebar) {
      settingsLogo?.remove();
    } else {
      if (!settingsLogo || settingsLogo.parentElement !== settingsSidebar) {
        settingsLogo?.remove();
        settingsLogo = document.createElement("div");
        settingsLogo.id = SETTINGS_LOGO_ID;
        settingsLogo.setAttribute("aria-hidden", "true");
        settingsLogo.innerHTML = '<img alt="">';
        settingsSidebar.appendChild(settingsLogo);
      }
      settingsLogo.querySelector("img").src = logoDarkDataUrl;
    }
    if (!root.classList.contains("codex-dream-skin")) root.classList.add("codex-dream-skin");
    root.setAttribute(SHELL_ATTR, shell);
    root.style.setProperty("--dream-skin-art", `url("${artUrl}")`);
    applyTheme(root, shell);

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || root).appendChild(style);
    }
    if (style.dataset.dreamSkinVersion !== VERSION) {
      style.textContent = cssText;
      style.dataset.dreamSkinVersion = VERSION;
    }

    const shellMain = document.querySelector("main.main-surface") || document.querySelector("main");
    const sidebar = document.querySelector("aside.app-shell-left-panel") || document.querySelector("aside");
    let sidebarBrand = document.getElementById(SIDEBAR_BRAND_ID);
    if (!sidebar) {
      sidebarBrand?.remove();
    } else {
      if (!sidebarBrand || sidebarBrand.parentElement !== sidebar) {
        sidebarBrand?.remove();
        sidebarBrand = document.createElement("div");
        sidebarBrand.id = SIDEBAR_BRAND_ID;
        sidebarBrand.setAttribute("aria-hidden", "true");
        sidebarBrand.innerHTML = '<img alt="">';
        sidebar.appendChild(sidebarBrand);
      }
      sidebarBrand.querySelector("img").src = logoDarkDataUrl;
      for (const node of sidebar.querySelectorAll(".codex-uq-sidebar-expand-label")) {
        if ((node.textContent || "").trim() !== "展开显示") {
          if (node.classList.contains("codex-uq-sidebar-expand-label")) {
            node.classList.remove("codex-uq-sidebar-expand-label");
          }
        }
      }
      const expandLabel = [...sidebar.querySelectorAll("button, div, span")].find((node) =>
        (node.textContent || "").trim() === "展开显示" &&
        ![...node.children].some((child) => (child.textContent || "").trim() === "展开显示"));
      if (expandLabel && !expandLabel.classList.contains("codex-uq-sidebar-expand-label")) {
        expandLabel.classList.add("codex-uq-sidebar-expand-label");
      }
      setInlineContrast(expandLabel, "#ffffff");
    }

    for (const row of document.querySelectorAll(".automation-row")) {
      row.style.setProperty("background", "#ffffff", "important");
      row.style.setProperty("border", "1px solid #ded5e3", "important");
      row.style.setProperty("color", "#24152d", "important");
    }
    const homeIndicator = document.querySelector('[data-testid="home-icon"]');
    const home = homeIndicator?.closest('[role="main"]') ||
      [...document.querySelectorAll('[role="main"]')].find((candidate) =>
        candidate.querySelector('[data-feature="game-source"]') &&
        candidate.querySelector('.group\\\\/home-suggestions')) || null;
    for (const candidate of document.querySelectorAll('[role="main"].dream-skin-home')) {
      if (candidate !== home && candidate.classList.contains("dream-skin-home")) {
        candidate.classList.remove("dream-skin-home");
      }
    }
    if (home && !home.classList.contains("dream-skin-home")) home.classList.add("dream-skin-home");

    const heroTitle = home?.querySelector('[data-feature="game-source"]') || null;
    setInlineContrast(heroTitle, "#ffffff");

    const hero = home?.querySelector(":scope > div:first-child > div:first-child > div:first-child") || null;
    let heroLogo = document.getElementById(HERO_LOGO_ID);
    if (!hero) {
      heroLogo?.remove();
    } else {
      if (!heroLogo || heroLogo.parentElement !== hero) {
        heroLogo?.remove();
        heroLogo = document.createElement("div");
        heroLogo.id = HERO_LOGO_ID;
        heroLogo.setAttribute("aria-hidden", "true");
        heroLogo.innerHTML = '<img alt="">';
        hero.appendChild(heroLogo);
      }
      heroLogo.querySelector("img").src = logoDarkDataUrl;
    }

    if (!shellMain || !document.body) return;
    if (shellMain.classList.contains("dream-skin-home-shell") !== Boolean(home)) {
      shellMain.classList.toggle("dream-skin-home-shell", Boolean(home));
    }
    let chrome = document.getElementById(CHROME_ID);
    if (!chrome || chrome.parentElement !== document.body) {
      chrome?.remove();
      chrome = document.createElement("div");
      chrome.id = CHROME_ID;
      chrome.setAttribute("aria-hidden", "true");
      chrome.innerHTML = `
        <div class="dream-skin-brand">
          <span class="dream-skin-logo-wrap">
            <img class="dream-skin-logo dream-skin-logo-dark" alt="">
            <img class="dream-skin-logo dream-skin-logo-light" alt="">
          </span>
          <span><b></b><small></small></span>
        </div>
        <div class="dream-skin-status"><i></i><span></span></div>
        <div class="dream-skin-quote"></div>
        <div class="dream-skin-particles"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="dream-skin-orbit"></div>`;
      document.body.appendChild(chrome);
    }
    chrome.querySelector(".dream-skin-logo-dark").src = logoDarkDataUrl;
    chrome.querySelector(".dream-skin-logo-light").src = logoLightDataUrl;
    chrome.querySelector(".dream-skin-brand b").textContent = THEME.name || "Codex Dream Skin";
    chrome.querySelector(".dream-skin-brand small").textContent = THEME.brandSubtitle || "CODEX DREAM SKIN";
    chrome.querySelector(".dream-skin-status span").textContent = THEME.statusText || "DREAM SKIN ONLINE";
    chrome.querySelector(".dream-skin-quote").textContent = THEME.quote || "MAKE SOMETHING WONDERFUL";
    const shellBox = shellMain.getBoundingClientRect();
    chrome.style.left = `${Math.round(shellBox.left)}px`;
    chrome.style.top = `${Math.round(shellBox.top)}px`;
    chrome.style.width = `${Math.round(shellBox.width)}px`;
    chrome.style.height = `${Math.round(shellBox.height)}px`;
    if (chrome.classList.contains("dream-skin-home-shell") !== Boolean(home)) {
      chrome.classList.toggle("dream-skin-home-shell", Boolean(home));
    }
    chrome.dataset.dreamShell = shell;
    syncSurfaceContrast();
  };

  const cleanup = () => {
    window[DISABLED_KEY] = true;
    document.documentElement?.classList.remove("codex-dream-skin");
    document.documentElement?.removeAttribute(SHELL_ATTR);
    document.documentElement?.style.removeProperty("--dream-skin-art");
    for (const name of THEME_VARIABLES) document.documentElement?.style.removeProperty(name);
    document.querySelectorAll(".dream-skin-home").forEach((node) => node.classList.remove("dream-skin-home"));
    document.querySelectorAll(".dream-skin-home-shell").forEach((node) => node.classList.remove("dream-skin-home-shell"));
    document.querySelectorAll(`.${DARK_SURFACE_CLASS}, .${LIGHT_SURFACE_CLASS}`).forEach((node) => {
      node.classList.remove(DARK_SURFACE_CLASS, LIGHT_SURFACE_CLASS);
    });
    document.querySelectorAll(".codex-uq-sidebar-expand-label").forEach((node) => {
      node.classList.remove("codex-uq-sidebar-expand-label");
    });
    document.querySelectorAll(`.${INLINE_CONTRAST_CLASS}`).forEach((node) => {
      node.style.removeProperty("color");
      node.classList.remove(INLINE_CONTRAST_CLASS);
    });
    document.getElementById(STYLE_ID)?.remove();
    document.getElementById(CHROME_ID)?.remove();
    document.getElementById(HERO_LOGO_ID)?.remove();
    document.getElementById(SIDEBAR_BRAND_ID)?.remove();
    document.getElementById(SETTINGS_LOGO_ID)?.remove();
    const state = window[STATE_KEY];
    state?.observer?.disconnect();
    if (state?.timer) clearInterval(state.timer);
    if (state?.scheduler?.timeout) clearTimeout(state.scheduler.timeout);
    if (state?.resizeHandler) window.removeEventListener("resize", state.resizeHandler);
    if (state?.mediaHandler && state?.mediaQuery) {
      try { state.mediaQuery.removeEventListener("change", state.mediaHandler); } catch {}
    }
    if (state?.artUrl) URL.revokeObjectURL(state.artUrl);
    delete window[STATE_KEY];
    return true;
  };

  clearInlineContrast(document.body);
  const scheduler = { timeout: null };
  const scheduleEnsure = () => {
    if (scheduler.timeout) return;
    scheduler.timeout = setTimeout(() => {
      scheduler.timeout = null;
      ensure();
    }, 16);
  };
  const isThemeManagedMutation = (mutation) => {
    if (mutation.type !== "attributes") return false;
    const element = mutation.target;
    if (!(element instanceof Element)) return false;
    if (element === document.documentElement && mutation.attributeName === "style") return true;
    if (element.id === CHROME_ID || element.closest?.(`#${CHROME_ID}`)) return true;
    if (element.classList.contains(INLINE_CONTRAST_CLASS)) return true;
    if (element.classList.contains(DARK_SURFACE_CLASS) || element.classList.contains(LIGHT_SURFACE_CLASS)) return true;
    if (element.classList.contains("automation-row") && mutation.attributeName === "style") return true;
    return false;
  };
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.type === "childList" || !isThemeManagedMutation(mutation))) {
      scheduleEnsure();
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "data-theme", "data-appearance", "data-color-mode", "style"],
  });
  const timer = setInterval(ensure, 4000);
  const resizeHandler = scheduleEnsure;
  window.addEventListener("resize", resizeHandler, { passive: true });

  let mediaQuery = null;
  let mediaHandler = null;
  try {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaHandler = () => scheduleEnsure();
    mediaQuery.addEventListener("change", mediaHandler);
  } catch {}

  window[STATE_KEY] = {
    ensure,
    cleanup,
    observer,
    timer,
    scheduler,
    resizeHandler,
    mediaQuery,
    mediaHandler,
    artUrl,
    version: VERSION,
    themeId: THEME.id || "custom",
    detectShellMode,
  };
  ensure();
  return { installed: true, version: VERSION, themeId: THEME.id || "custom", shell: detectShellMode() };
})(__DREAM_SKIN_CSS_JSON__, __DREAM_SKIN_ART_JSON__, __DREAM_SKIN_LOGO_LIGHT_JSON__, __DREAM_SKIN_LOGO_DARK_JSON__, __DREAM_SKIN_THEME_JSON__)
