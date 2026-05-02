import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { APP_STRINGS } from "@constants/strings";
import { ROUTES } from "@constants/routes";
import { cn } from "@helpers/classNames";
import styles from "./Header.module.css";

export interface HeaderProps {
  className?: string;
}

/**
 * Top app header with brand wordmark, primary nav and user menu.
 *
 * The user menu is a tiny menu rather than a third-party popover - we
 * only need open/close + click-outside.
 */
export function Header({ className }: HeaderProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut({ callbackUrl: ROUTES.login });
  };

  return (
    <header className={cn(styles.header, className)}>
      <div className={styles.left}>
        <Link href={ROUTES.dashboard} className={styles.brand}>
          {APP_STRINGS.brand.name}
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <Link href={ROUTES.dashboard} className={styles.navLink}>
            {APP_STRINGS.header.timesheetsLink}
          </Link>
        </nav>
      </div>

      {session?.user ? (
        <div className={styles.userMenu}>
          <button
            type="button"
            className={styles.userButton}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => {
              // Defer so a click on a menu item still fires before close.
              setTimeout(() => setMenuOpen(false), 100);
            }}
          >
            <span>{session.user.name}</span>
            <span aria-hidden className={styles.chevron}>
              ▾
            </span>
          </button>
          {menuOpen ? (
            <div role="menu" className={styles.menu}>
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                onClick={handleSignOut}
              >
                {APP_STRINGS.header.signOut}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
