import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import { LoginForm } from "@components/login/LoginForm/LoginForm";
import { authOptions } from "./api/auth/[...nextauth]";
import { ROUTES } from "@constants/routes";
import { APP_STRINGS } from "@constants/strings";
import styles from "./login.module.css";

/**
 * Two-column login layout matching the design.
 *  - Left: form, vertically centered.
 *  - Right: brand panel with name + tagline (hidden on small screens).
 */
export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Sign in — {APP_STRINGS.brand.name}</title>
      </Head>
      <div className={styles.layout}>
        <section className={styles.formColumn}>
          <div className={styles.formCenter}>
            <LoginForm />
          </div>
        </section>
        <aside className={styles.brandColumn}>
          <div className={styles.brandContent}>
            <h2 className={styles.brandTitle}>{APP_STRINGS.brand.name}</h2>
            <p className={styles.brandTagline}>
              {APP_STRINGS.brand.tagline}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

/**
 * Already-authenticated users skip the login form.
 */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (session) {
    return { redirect: { destination: ROUTES.dashboard, permanent: false } };
  }
  return { props: {} };
};
