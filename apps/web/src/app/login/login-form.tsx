"use client";

import { login, type LoginState } from "@/app/auth/actions";
import Link from "next/link";
import { useActionState } from "react";
import { IconLock, IconMail } from "@/components/icons";
import styles from "./login.module.css";

type LoginFormProps = {
  initialError?: string;
};

export function LoginForm({ initialError }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<LoginState | null, FormData>(
    login,
    null,
  );

  const errorMessage = state?.error ?? initialError;

  return (
    <div className={styles.authBox}>
      <div className={styles.authMobileLogo}>
        <span>Kai</span>Edu
      </div>

      <h2 className={styles.authTitle}>Bienvenido de nuevo</h2>
      <p className={styles.subtitle}>
        Accede a KaiEdu con tu cuenta institucional.
      </p>

      <form className={styles.form} action={formAction}>
        <div className={styles.field}>
          <label htmlFor="email">Correo electrónico</label>
          <div className={styles.inputGroup}>
            <span className={styles.inputPrefix}>
              <IconMail size={18} />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@colegio.edu"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Contraseña</label>
          <div className={styles.inputGroup}>
            <span className={styles.inputPrefix}>
              <IconLock size={18} />
            </span>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>
        </div>

        {errorMessage ? (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button className={styles.submit} type="submit" disabled={pending}>
          {pending ? "Entrando…" : "Iniciar sesión"}
        </button>
      </form>

      <Link className={styles.back} href="/">
        Volver al inicio
      </Link>
    </div>
  );
}
