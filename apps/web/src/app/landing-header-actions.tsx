"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "./page.module.css";

export function LandingHeaderActions() {
  return (
    <div className={styles.headerActions}>
      <ThemeToggle />
      <Link className={styles.loginLink} href="/login">
        Iniciar sesión
      </Link>
    </div>
  );
}
