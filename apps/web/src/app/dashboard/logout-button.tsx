"use client";

import { logout } from "@/app/auth/actions";
import styles from "./dashboard.module.css";

export function LogoutButton() {
  return (
    <button className={styles.logout} type="button" onClick={() => logout()}>
      Cerrar sesión
    </button>
  );
}
