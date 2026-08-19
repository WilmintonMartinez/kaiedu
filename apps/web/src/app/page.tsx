import Link from "next/link";
import { LandingHeaderActions } from "./landing-header-actions";
import { IconBook, IconChart, IconUsers } from "@/components/icons";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>
          <span className={styles.logoAccent}>Kai</span>Edu
        </span>
        <LandingHeaderActions />
      </header>

      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <p className={styles.badge}>Plataforma en desarrollo</p>
          <h1>Gestión escolar inteligente</h1>
          <p className={styles.lead}>
            Matrícula, asistencia, calificaciones, comunicación con familias y
            administración en un solo lugar. Pensado para colegios modernos.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.ctaPrimary} href="/login">
              Entrar al sistema
            </Link>
            <a className={styles.ctaSecondary} href="#modulos">
              Ver módulos
            </a>
          </div>
        </div>
      </section>

      <main className={styles.main} id="modulos">
        <div className={styles.sectionTitle}>Módulos principales</div>
        <section className={styles.features} aria-label="Módulos principales">
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <IconBook size={22} />
            </span>
            <strong>Académico</strong>
            <span>Grupos, horarios, notas y boletas</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <IconUsers size={22} />
            </span>
            <strong>Comunidad</strong>
            <span>Portales para docentes, alumnos y padres</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <IconChart size={22} />
            </span>
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
