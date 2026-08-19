"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import styles from "./login.module.css";

export function AuthPanelActions() {
  return (
    <div className={styles.authPanelActions}>
      <ThemeToggle />
    </div>
  );
}
