import { requireAuthProfile } from "@/lib/auth/profile";
import { USER_ROLE_LABELS } from "@/lib/types/profile";
import Link from "next/link";
import { DashboardNav } from "./dashboard-nav";
import { LogoutButton } from "./logout-button";
import styles from "./shell.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAuthProfile();
  const isAdmin = profile.role === "administrador";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <Link className={styles.logo} href="/dashboard">
            KaiEdu
          </Link>

          <div className={styles.userBox}>
            <p className={styles.userName}>{profile.full_name}</p>
            <p className={styles.userMeta}>
              {USER_ROLE_LABELS[profile.role]} · {profile.email}
            </p>
          </div>

          <DashboardNav isAdmin={isAdmin} />
          <LogoutButton />
        </div>
      </aside>

      <div className={styles.content}>
        <header className={styles.mobileHeader}>
          <span className={styles.mobileTitle}>KaiEdu</span>
          <LogoutButton />
        </header>

        <div className={styles.mobileNav}>
          <DashboardNav isAdmin={isAdmin} horizontal />
        </div>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
