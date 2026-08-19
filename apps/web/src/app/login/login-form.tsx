"use client";

import { login, type LoginState } from "@/app/auth/actions";
import Link from "next/link";
import { useActionState } from "react";
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
    <div className={styles.card}>
      <h1>Iniciar sesión</h1>
      <p className={styles.subtitle}>
        Accede a KaiEdu con tu cuenta institucional.
      </p>

      <form className={styles.form} action={formAction}>
        <div className={styles.field}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="tu@colegio.edu"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>

        {errorMessage ? (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button className={styles.submit} type="submit" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <Link className={styles.back} href="/">
        Volver al inicio
      </Link>
    </div>
  );
}
