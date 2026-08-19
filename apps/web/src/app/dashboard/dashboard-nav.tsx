"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconCalendar,
  IconChart,
  IconChevronDown,
  IconHome,
  IconUsers,
} from "@/components/icons";
import styles from "./shell.module.css";

type DashboardNavProps = {
  isAdmin: boolean;
  collapsed?: boolean;
};

export function DashboardNav({ isAdmin, collapsed = false }: DashboardNavProps) {
  const pathname = usePathname();
  const dashboardActive = pathname === "/dashboard";
  const adminActive = pathname.startsWith("/dashboard/usuarios");
  const [adminOpen, setAdminOpen] = useState(adminActive);

  useEffect(() => {
    if (adminActive) {
      setAdminOpen(true);
    }
  }, [adminActive]);

  return (
    <>
      <Link
        className={`${styles.navStandalone} ${dashboardActive ? styles.navStandaloneActive : ""}`}
        href="/dashboard"
        title="Panel"
        data-tooltip={collapsed ? "Panel" : undefined}
      >
        <span className={styles.navFactoryToggle}>
          <span className={styles.navFactoryIcon}>
            <IconHome size={18} />
          </span>
          <span className={styles.navFactoryLabel}>Panel</span>
        </span>
      </Link>

      <div className={styles.navDivider}>Gestión escolar</div>

      {isAdmin ? (
        <div className={styles.navFactoryGroup}>
          <button
            type="button"
            className={styles.navFactoryToggle}
            aria-expanded={adminOpen}
            onClick={() => setAdminOpen((open) => !open)}
            title="Administración"
            data-tooltip={collapsed ? "Administración" : undefined}
          >
            <span className={styles.navFactoryIcon}>
              <IconUsers size={18} />
            </span>
            <span className={styles.navFactoryLabel}>Administración</span>
            <IconChevronDown
              className={`${styles.navFactoryChevron} ${adminOpen ? styles.navFactoryChevronOpen : ""}`}
              size={14}
            />
          </button>

          {adminOpen ? (
            <div className={styles.navFactoryLinks}>
              <Link
                className={`${styles.navFactoryLink} ${pathname.startsWith("/dashboard/usuarios") ? styles.navFactoryLinkActive : ""}`}
                href="/dashboard/usuarios"
                title="Usuarios"
                data-tooltip={collapsed ? "Usuarios" : undefined}
              >
                <IconUsers className={styles.navFactoryLinkIcon} size={16} />
                <span className={styles.navFactoryBullet} aria-hidden />
                <span className={styles.navFactoryLinkText}>Usuarios</span>
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={styles.navDivider}>Próximamente</div>

      <span className={`${styles.navLink} ${styles.navLinkDisabled}`} title="Matrícula">
        <IconCalendar className={styles.navIcon} size={18} />
        <span className={styles.navLabel}>Matrícula</span>
      </span>
      <span className={`${styles.navLink} ${styles.navLinkDisabled}`} title="Calificaciones">
        <IconChart className={styles.navIcon} size={18} />
        <span className={styles.navLabel}>Calificaciones</span>
      </span>
    </>
  );
}
