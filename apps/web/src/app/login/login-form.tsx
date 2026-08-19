"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("Correo o contraseña incorrectos. Verifica tus datos.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "No se pudo conectar con el servidor. Revisa la configuración de Supabase.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <h1>Iniciar sesión</h1>
      <p className={styles.subtitle}>
        Accede a KaiEdu con tu cuenta institucional.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <Link className={styles.back} href="/">
        Volver al inicio
      </Link>
    </div>
  );
}
