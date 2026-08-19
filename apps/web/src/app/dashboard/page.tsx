import type { Metadata } from "next";
import { requireAuthProfile } from "@/lib/auth/profile";
import { USER_ROLE_LABELS } from "@/lib/types/profile";
import Link from "next/link";
import shell from "./shell.module.css";

export const metadata: Metadata = {
  title: "Panel — KaiEdu",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const profile = await requireAuthProfile();
  const isAdmin = profile.role === "administrador";

  return (
    <>
      <div className={shell.pageHeader}>
        <div>
          <h1>Bienvenido, {profile.full_name}</h1>
          <p>
            Rol: {USER_ROLE_LABELS[profile.role]} · {profile.email}
          </p>
        </div>
      </div>

      <section className={shell.card}>
        <p style={{ color: "var(--kai-muted)", lineHeight: 1.6 }}>
          Has iniciado sesión en KaiEdu. Desde aquí podrás acceder a matrícula,
          asistencia, calificaciones y más módulos conforme los vayamos
          activando.
        </p>

        {isAdmin ? (
          <p style={{ marginTop: "1rem" }}>
            <Link className={shell.primaryButton} href="/dashboard/usuarios">
              Gestionar usuarios
            </Link>
          </p>
        ) : null}
      </section>
    </>
  );
}
