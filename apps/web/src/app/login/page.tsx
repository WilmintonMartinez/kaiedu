import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Iniciar sesión — KaiEdu",
  description: "Accede a la plataforma KaiEdu.",
};

const URL_ERRORS: Record<string, string> = {
  cuenta_inactiva: "Tu cuenta está desactivada. Contacta al administrador.",
  sin_perfil:
    "Tu sesión está activa pero falta tu perfil en el sistema. El administrador debe ejecutar la migración SQL en Supabase.",
  auth: "No se pudo completar la autenticación. Intenta de nuevo.",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const errorCode = Array.isArray(params.error)
    ? params.error[0]
    : params.error;
  const urlError = errorCode ? URL_ERRORS[errorCode] : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await getCurrentUserProfile();

    if (profile?.is_active) {
      redirect("/dashboard");
    }

    const sessionMessage =
      urlError ??
      (profile && !profile.is_active
        ? URL_ERRORS.cuenta_inactiva
        : "Tu sesión está activa pero tu perfil aún no está listo en KaiEdu. Pide al administrador que ejecute el SQL de perfiles en Supabase.");

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Link className={styles.logo} href="/">
            KaiEdu
          </Link>
        </header>

        <main className={styles.main}>
          <div className={styles.card}>
            <h1>No puedes entrar aún</h1>
            <p className={styles.subtitle}>Sesión: {user.email}</p>
            <p className={styles.warning}>{sessionMessage}</p>
            <form action="/auth/logout" method="post">
              <button className={styles.submit} type="submit">
                Cerrar sesión
              </button>
            </form>
            <Link className={styles.back} href="/">
              Volver al inicio
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          KaiEdu
        </Link>
      </header>

      <main className={styles.main}>
        <LoginForm initialError={urlError} />
      </main>
    </div>
  );
}
