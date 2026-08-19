import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Panel — KaiEdu",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          KaiEdu
        </Link>
        <LogoutButton />
      </header>

      <main className={styles.main}>
        <section className={styles.card}>
          <h1>Bienvenido a KaiEdu</h1>
          <p className={styles.email}>{user.email}</p>
          <p className={styles.note}>
            Has iniciado sesión correctamente. Aquí irá el panel del colegio:
            matrícula, asistencia, calificaciones y más.
          </p>
        </section>
      </main>
    </div>
  );
}
