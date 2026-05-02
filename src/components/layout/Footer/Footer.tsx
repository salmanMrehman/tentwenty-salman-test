import { APP_STRINGS } from "@constants/strings";
import styles from "./Footer.module.css";

/**
 * App footer. Pure presentational; pulls the year at render time so it
 * stays current without a build step.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>{APP_STRINGS.footer.copyright(year)}</p>
    </footer>
  );
}
