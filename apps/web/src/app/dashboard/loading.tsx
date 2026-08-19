import styles from "./shell.module.css";

export default function DashboardLoading() {
  return (
    <div className={styles.loadingWrap}>
      <p className={styles.loadingText}>Cargando panel…</p>
    </div>
  );
}
