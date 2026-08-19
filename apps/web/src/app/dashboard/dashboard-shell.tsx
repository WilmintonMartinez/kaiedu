"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types/profile";
import { USER_ROLE_LABELS } from "@/lib/types/profile";
import { IconChevronDown, IconLogout, IconMenu } from "@/components/icons";
import { ThemeSync } from "@/components/theme-sync";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ThemeMode } from "@/lib/theme/constants";
import { DashboardNav } from "./dashboard-nav";
import styles from "./shell.module.css";

type DashboardShellProps = {
  profile: Profile;
  isAdmin: boolean;
  children: React.ReactNode;
};

export function DashboardShell({ profile, isAdmin, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 992 && localStorage.getItem("kaiedu-sidebar-collapsed") === "1") {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("kaiedu-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  const initial = profile.full_name.trim().charAt(0).toUpperCase() || "K";
  const userTheme: ThemeMode =
    profile.theme === "dark" || profile.theme === "light" ? profile.theme : "light";
  const today = new Intl.DateTimeFormat("es-NI", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className={`${styles.wrapper} ${collapsed ? styles.wrapperCollapsed : ""}`}>
      <ThemeSync serverTheme={userTheme} />
      <button
        type="button"
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayShow : ""}`}
        aria-label="Cerrar menú"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarBrand}>
          <Link className={styles.brandName} href="/dashboard">
            <span className={styles.brandAccent}>Kai</span>Edu{" "}
            <span className={styles.brandVersion}>MVP</span>
          </Link>
          <div className={styles.brandSub}>Sistema de gestión escolar</div>
        </div>

        <nav className={styles.sidebarNav} aria-label="Menú principal">
          <DashboardNav isAdmin={isAdmin} collapsed={collapsed} />
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.sidebarFooterIcon} aria-hidden>
            ◉
          </span>
          Supabase · KaiEdu Cloud
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Abrir menú"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu />
            </button>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.iconButtonDesktop}`}
              aria-label="Contraer menú"
              onClick={toggleCollapsed}
            >
              <IconMenu />
            </button>
            <span className={styles.headerDate}>{today}</span>
          </div>

          <div className={styles.headerRight}>
            <ThemeToggle serverTheme={userTheme} persistToAccount />
            <div className={styles.userMenu}>
              <button
                type="button"
                className={styles.userButton}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className={styles.avatar}>{initial}</span>
                <span className={styles.userName}>{profile.full_name}</span>
                <IconChevronDown className={styles.userChevron} />
              </button>

              {menuOpen ? (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownMeta}>
                    <strong>{profile.full_name}</strong>
                    <span>{profile.email}</span>
                    <span>{USER_ROLE_LABELS[profile.role]}</span>
                  </div>
                  <form action="/auth/logout" method="post">
                    <button className={styles.dropdownLogout} type="submit">
                      <IconLogout />
                      Cerrar sesión
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className={styles.content}>{children}</main>

        <footer className={styles.footer}>
          KaiEdu · Desarrollado por Wilminton Díaz · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
