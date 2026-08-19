import {
  toggleUserActive,
  updateUserRole,
} from "@/app/dashboard/usuarios/actions";
import { requireAdminProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import {
  USER_ROLE_LABELS,
  USER_ROLES,
  type Profile,
} from "@/lib/types/profile";
import type { Metadata } from "next";
import Link from "next/link";
import shell from "../shell.module.css";
import styles from "./usuarios.module.css";

export const metadata: Metadata = {
  title: "Usuarios — KaiEdu",
};

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  await requireAdminProfile();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as Profile[];

  return (
    <>
      <div className={shell.pageHeader}>
        <div>
          <h1>Usuarios del sistema</h1>
          <p>Registra y administra quién puede usar KaiEdu.</p>
        </div>
        <Link className={shell.primaryButton} href="/dashboard/usuarios/nuevo">
          Nuevo usuario
        </Link>
      </div>

      {error ? (
        <section className={shell.card}>
          <p className={styles.error}>
            No se pudo cargar la lista. Ejecuta la migración SQL en Supabase
            (`supabase/migrations/001_user_profiles.sql`).
          </p>
        </section>
      ) : null}

      <section className={shell.card}>
        {users.length === 0 ? (
          <p className={styles.empty}>Aún no hay usuarios registrados.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <form
                        action={updateUserRole}
                        style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                      >
                        <input name="user_id" type="hidden" value={user.id} />
                        <select
                          className={styles.roleSelect}
                          name="role"
                          defaultValue={user.role}
                        >
                          {USER_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {USER_ROLE_LABELS[role]}
                            </option>
                          ))}
                        </select>
                        <button className={styles.toggleButton} type="submit">
                          Guardar
                        </button>
                      </form>
                    </td>
                    <td>
                      <span
                        className={
                          user.is_active ? styles.statusActive : styles.statusInactive
                        }
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <form action={toggleUserActive}>
                        <input name="user_id" type="hidden" value={user.id} />
                        <input
                          name="is_active"
                          type="hidden"
                          value={String(!user.is_active)}
                        />
                        <button className={styles.toggleButton} type="submit">
                          {user.is_active ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
