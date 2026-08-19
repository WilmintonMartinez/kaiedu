import { requireAuthProfile } from "@/lib/auth/profile";
import { DashboardShell } from "./dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAuthProfile();
  const isAdmin = profile.role === "administrador";

  return (
    <DashboardShell profile={profile} isAdmin={isAdmin}>
      {children}
    </DashboardShell>
  );
}
