import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MOCK_USERS } from "@mocks/users";
import { ROUTES } from "@constants/routes";

/**
 * next-auth configuration.
 *
 * Strategy:
 *  - JWT sessions (no DB; the spec says dummy auth).
 *  - Credentials provider that validates against `MOCK_USERS`.
 *  - 7-day max age; the "Remember me" toggle is informational only since
 *    next-auth v4's credentials provider can't conditionally set cookie
 *    duration per request without custom work. We surface the toggle to
 *    show the UI but document this limitation in the README.
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: ROUTES.login,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const email = credentials.email.trim().toLowerCase();
        const user = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email && u.password === credentials.password,
        );
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
