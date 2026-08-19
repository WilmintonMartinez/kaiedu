"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./shell.module.css";

type DashboardNavProps = {
  isAdmin: boolean;
  horizontal?: boolean;
};

export function DashboardNav({ isAdmin, horizontal = false }: DashboardNavProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Inicio" },
    ...(isAdmin ? [{ href: "/dashboard/usuarios", label: "Usuarios" }] : []),
  ];

  return (
    <nav
      className={`${styles.nav} ${horizontal ? styles.navHorizontal : ""}`}
      aria-label="Menú principal"
    >
      {links.map((link) => {
        const isActive =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            href={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
