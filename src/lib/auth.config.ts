import type { NextAuthConfig } from "next-auth";

const THIRTY_DAYS = 30 * 24 * 60 * 60;

/**
 * Edge-safe auth config (no Prisma). Used by middleware on Vercel.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/portal/login",
  },
  session: {
    strategy: "jwt",
    maxAge: THIRTY_DAYS,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: THIRTY_DAYS,
  },
  providers: [],
} satisfies NextAuthConfig;
