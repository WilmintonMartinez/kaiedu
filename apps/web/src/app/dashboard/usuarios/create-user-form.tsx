"use client";

import { createUser, type UserFormState } from "@/app/dashboard/usuarios/actions";
import { USER_ROLE_LABELS, USER_ROLES } from "@/lib/types/profile";
import Link from "next/link";
import { useActionState } from "react";
import shell from "../shell.module.css";
import styles from "./usuarios.module.css";

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState<
    UserFormState | null,
    FormData
  >(createUser, null);

  return (
    <section className={shell.card}>
      <form className={styles.formGrid} action={formAction}>
        <div className={styles.field}>
          <label htmlFor="full_name">Nombre completo</label>
          <input id="full_name" name="full_name" required placeholder="María López" />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="usuario@colegio.edu"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Contraseña temporal</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="role">Rol</label>
          <select id="role" name="role" required defaultValue="invitado">
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {USER_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        {state?.error ? (
          <p className={`${styles.error} ${styles.fullWidth}`} role="alert">
            {state.error}
          </p>
        ) : null}

        {state?.success ? (
          <p className={`${styles.success} ${styles.fullWidth}`} role="status">
            {state.success}
          </p>
        ) : null}

        <div className={`${styles.fullWidth}`} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button className={shell.primaryButton} type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Registrar usuario"}
          </button>
          <Link className={shell.secondaryButton} href="/dashboard/usuarios">
            Volver al listado
          </Link>
        </div>
      </form>
    </section>
  );
}
