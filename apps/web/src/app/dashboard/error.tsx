"use client";

import Link from "next/link";
import styles from "./shell.module.css";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <section className={styles.card}>
          <h1 style={{ marginBottom: "0.75rem" }}>No se pudo cargar el panel</h1>
          <p style={{ color: "var(--kai-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
            Ocurrió un error al mostrar KaiEdu. Si acabas de configurar Supabase,
            ejecuta también el script{" "}
            <code>002_fix_profiles_rls.sql</code> en el SQL Editor.
          </p>
          {error.message ? (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--kai-danger)",
                marginBottom: "1rem",
              }}
            >
              {error.message}
            </p>
          ) : null}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className={styles.primaryButton} type="button" onClick={reset}>
              Reintentar
            </button>
            <Link className={styles.secondaryButton} href="/login">
              Ir al login
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
