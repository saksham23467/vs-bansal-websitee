import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma). Used by middleware on Vercel.
 * Full auth with DB lives in auth.ts.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/portal/login",
  },
  session: { strategy: "jwt" },
  providers: [],
} satisfies NextAuthConfig;
