import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth/profile";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  IconBook,
  IconCalendar,
  IconChart,
  IconMail,
  IconUsers,
} from "@/components/icons";
import { PageHeader } from "./page-header";
import shell from "./shell.module.css";

export const metadata: Metadata = {
  title: "Panel — KaiEdu",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();

  if (!profile?.is_active) {
    redirect("/login");
  }

  const isAdmin = profile.role === "administrador";

  const supabase = await createClient();
  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <>
      <PageHeader
        pretitle="Panel principal"
        title={`Bienvenido, ${profile.full_name}`}
        subtitle={`${profile.email} · ${isAdmin ? "Administrador" : "Usuario"}`}
        breadcrumb={[
          { label: "Panel", href: "/dashboard" },
          { label: "Inicio" },
        ]}
      />

      <div className={shell.statGrid}>
        <div className={shell.statCard}>
          <div className={shell.statCardInner}>
            <div>
              <div className={shell.statLabel}>Usuarios registrados</div>
              <div className={shell.statValue}>{userCount ?? 0}</div>
            </div>
            <div className={`${shell.statIcon} ${shell.statIconPrimary}`}>
              <IconUsers size={22} />
            </div>
          </div>
        </div>

        <div className={shell.statCard}>
          <div className={shell.statCardInner}>
            <div>
              <div className={shell.statLabel}>Estudiantes</div>
              <div className={shell.statValue}>—</div>
            </div>
            <div className={`${shell.statIcon} ${shell.statIconSuccess}`}>
              <IconBook size={22} />
            </div>
          </div>
        </div>

        <div className={shell.statCard}>
          <div className={shell.statCardInner}>
            <div>
              <div className={shell.statLabel}>Año lectivo</div>
              <div className={shell.statValue} style={{ fontSize: "1.25rem" }}>
                Por configurar
              </div>
            </div>
            <div className={`${shell.statIcon} ${shell.statIconWarning}`}>
              <IconCalendar size={22} />
            </div>
          </div>
        </div>

        <div className={shell.statCard}>
          <div className={shell.statCardInner}>
            <div>
              <div className={shell.statLabel}>Módulos activos</div>
              <div className={shell.statValue}>{isAdmin ? 2 : 1}</div>
            </div>
            <div className={`${shell.statIcon} ${shell.statIconInfo}`}>
              <IconChart size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className={shell.cardGrid}>
        <section className={shell.card}>
          <div className={shell.cardHeader}>
            <IconBook size={18} />
            Resumen de KaiEdu
          </div>
          <div className={shell.cardBody}>
            <p style={{ marginBottom: "1rem" }}>
              Plataforma de gestión escolar para matrícula, asistencia,
              calificaciones y comunicación con familias. Los módulos se irán
              activando conforme avance el proyecto piloto.
            </p>
            {isAdmin ? (
              <Link className={shell.primaryButton} href="/dashboard/usuarios">
                Gestionar usuarios
              </Link>
            ) : null}
          </div>
        </section>

        <section className={shell.card}>
          <div className={shell.cardHeader}>
            <IconMail size={18} />
            Próximos módulos
          </div>
          <div className={shell.cardBody}>
            <ul style={{ display: "grid", gap: "0.5rem", paddingLeft: "1.1rem" }}>
              <li>Institución y datos del colegio</li>
              <li>Año lectivo y grupos</li>
              <li>Padrón de estudiantes</li>
              <li>Asistencia y calificaciones</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
