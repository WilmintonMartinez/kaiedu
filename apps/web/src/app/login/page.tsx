import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IconBook, IconChart, IconUsers } from "@/components/icons";
import { getCurrentUserProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { AuthPanelActions } from "./auth-panel-actions";
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

function AuthBrandPanel() {
  return (
    <div className={styles.authBrand}>
      <div className={styles.authBrandInner}>
        <h1>
          <span className={styles.authBrandAccent}>Kai</span>Edu
        </h1>
        <p>Gestión escolar inteligente para colegios que quieren dejar el papel y el Excel atrás.</p>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <IconUsers size={18} />
          </span>
          Portales para docentes, estudiantes y familias
        </div>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <IconBook size={18} />
          </span>
          Matrícula, asistencia y calificaciones
        </div>
        <div className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <IconChart size={18} />
          </span>
          Reportes y administración institucional
        </div>
      </div>
    </div>
  );
}

function SessionBlockedPanel({
  email,
  message,
}: {
  email: string;
  message: string;
}) {
  return (
    <div className={styles.authPanel}>
      <AuthPanelActions />
      <div className={styles.authBox}>
        <h2 className={styles.authTitle}>No puedes entrar aún</h2>
        <p className={styles.subtitle}>Sesión: {email}</p>
        <p className={styles.warning}>{message}</p>
        <form action="/auth/logout" method="post">
          <button className={styles.submit} type="submit">
            Cerrar sesión
          </button>
        </form>
        <Link className={styles.back} href="/">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

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
      <div className={styles.authWrapper}>
        <AuthBrandPanel />
        <SessionBlockedPanel email={user.email ?? ""} message={sessionMessage} />
      </div>
    );
  }

  return (
    <div className={styles.authWrapper}>
      <AuthBrandPanel />
      <div className={styles.authPanel}>
        <AuthPanelActions />
        <LoginForm initialError={urlError} />
      </div>
    </div>
  );
}
