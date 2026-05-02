import { ReactNode } from "react";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import styles from "./PageShell.module.css";

export interface PageShellProps {
  children: ReactNode;
}

/**
 * Top-level layout used by every authenticated page (Header + content +
 * Footer). Login uses its own layout.
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.content}>{children}</div>
      <div className={styles.footerArea}>
        <Footer />
      </div>
    </div>
  );
}
