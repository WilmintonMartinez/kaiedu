import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Iniciar sesión — KaiEdu",
  description: "Accede a la plataforma KaiEdu.",
};

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          KaiEdu
        </Link>
      </header>

      <main className={styles.main}>
        <LoginForm />
      </main>
    </div>
  );
}
