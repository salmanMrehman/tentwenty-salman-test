import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { ROUTES } from "@constants/routes";

/**
 * Root page: redirect to dashboard if signed in, otherwise to login.
 */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  return {
    redirect: {
      destination: session ? ROUTES.dashboard : ROUTES.login,
      permanent: false,
    },
  };
};

export default function Index() {
  return null;
}
