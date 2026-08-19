"use client";

import { updateUserTheme } from "@/app/theme/actions";
import { applyTheme, getStoredTheme, type ThemeMode } from "@/lib/theme/constants";
import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@/components/icons";
import styles from "./theme-toggle.module.css";

type ThemeToggleProps = {
  className?: string;
  serverTheme?: ThemeMode | null;
  persistToAccount?: boolean;
};

export function ThemeToggle({
  className,
  serverTheme = null,
  persistToAccount = false,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    if (serverTheme === "light" || serverTheme === "dark") {
      setTheme(serverTheme);
      return;
    }

    setTheme(getStoredTheme());
  }, [serverTheme]);

  async function toggleTheme() {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);

    if (persistToAccount) {
      await updateUserTheme(nextTheme);
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className ?? ""}`}
      onClick={toggleTheme}
      title={isDark ? "Usar tema claro" : "Usar tema oscuro"}
      aria-label={isDark ? "Usar tema claro" : "Usar tema oscuro"}
    >
      {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  );
}
