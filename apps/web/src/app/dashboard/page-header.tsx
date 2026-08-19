import Link from "next/link";
import styles from "./shell.module.css";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  pretitle?: string;
  title: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  action?: React.ReactNode;
};

export function PageHeader({
  pretitle,
  title,
  subtitle,
  breadcrumb,
  action,
}: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div>
        {pretitle ? <div className={styles.pagePretitle}>{pretitle}</div> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      <div className={styles.pageHeaderAside}>
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className={styles.breadcrumb} aria-label="Ruta">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;

              return (
                <span key={`${item.label}-${index}`} className={styles.breadcrumbItem}>
                  {item.href && !isLast ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    <span className={isLast ? styles.breadcrumbActive : undefined}>
                      {item.label}
                    </span>
                  )}
                  {!isLast ? <span className={styles.breadcrumbSep}>/</span> : null}
                </span>
              );
            })}
          </nav>
        ) : null}
        {action ? <div className={styles.pageHeaderAction}>{action}</div> : null}
      </div>
    </div>
  );
}
