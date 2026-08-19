"use client";

import { applyTheme, getStoredTheme, type ThemeMode } from "@/lib/theme/constants";
import { useEffect } from "react";

type ThemeSyncProps = {
  serverTheme?: ThemeMode | null;
};

export function ThemeSync({ serverTheme }: ThemeSyncProps) {
  useEffect(() => {
    if (serverTheme === "light" || serverTheme === "dark") {
      applyTheme(serverTheme);
      return;
    }

    applyTheme(getStoredTheme());
  }, [serverTheme]);

  return null;
}
