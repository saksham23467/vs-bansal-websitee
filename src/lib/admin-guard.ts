import type { Session } from "next-auth";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";

export type AdminSession = Session;

export function isAdminRole(role: string | undefined | null): boolean {
  return role === UserRole.ADMIN || role === UserRole.STAFF;
}

/**
 * Resolves the current session and verifies the caller is an admin/staff user.
 * Returns either the session or an error tuple suitable for an API response.
 */
export async function requireAdmin(): Promise<
  | { ok: true; session: AdminSession }
  | { ok: false; status: number; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  if (!isAdminRole(session.user.role)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  return { ok: true, session };
}
