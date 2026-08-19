export const THEME_STORAGE_KEY = "kaiedu-theme";
export const THEME_COOKIE_KEY = "kaiedu-theme";

export type ThemeMode = "light" | "dark";

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "dark" ? "dark" : "light";
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export const themeInitScript = `(function(){try{var k="${THEME_COOKIE_KEY}";var c=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]+)"));var fromCookie=c?decodeURIComponent(c[1]):null;var fromStorage=localStorage.getItem("${THEME_STORAGE_KEY}");var theme=(fromCookie==="dark"||(!fromCookie&&fromStorage==="dark"))?"dark":"light";if(fromCookie&&fromCookie!==fromStorage){localStorage.setItem("${THEME_STORAGE_KEY}",fromCookie);}document.documentElement.setAttribute("data-theme",theme);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;
