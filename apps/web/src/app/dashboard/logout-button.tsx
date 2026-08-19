import styles from "./shell.module.css";

export function LogoutButton() {
  return (
    <form action="/auth/logout" method="post">
      <button className={styles.logout} type="submit">
        Cerrar sesión
      </button>
    </form>
  );
}
