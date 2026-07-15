import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe subset of the Auth.js config: no Prisma adapter, no Credentials
 * provider (both pull in Node-only DB code). Middleware only needs to read
 * the JWT to know who's logged in, so it uses this config directly instead
 * of the full one in `auth.ts`. See https://authjs.dev/guides/edge-compatibility
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  // Vercel/most PaaS deployments terminate TLS in front of the app and forward
  // the original Host header, which Auth.js otherwise refuses to trust in
  // production. Safe to trust here since NEXTAUTH_URL pins the expected origin.
  trustHost: true,
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.kycStatus = user.kycStatus;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.kycStatus = token.kycStatus as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
