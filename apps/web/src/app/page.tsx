import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>KaiEdu</span>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.badge}>Plataforma en desarrollo</p>
          <h1>Gestión escolar inteligente</h1>
          <p className={styles.lead}>
            Matrícula, asistencia, calificaciones, comunicación con familias y
            administración en un solo lugar. Pensado para colegios que quieren
            dejar el papel y el Excel atrás.
          </p>
        </div>

        <section className={styles.features} aria-label="Módulos principales">
          <div className={styles.feature}>
            <strong>Académico</strong>
            <span>Grupos, horarios, notas y boletas</span>
          </div>
          <div className={styles.feature}>
            <strong>Comunidad</strong>
            <span>Portales para docentes, alumnos y padres</span>
          </div>
          <div className={styles.feature}>
            <strong>Administración</strong>
            <span>Matrícula, reportes y gestión institucional</span>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>KaiEdu · Desarrollado por Wilminton Díaz</p>
      </footer>
    </div>
  );
}
