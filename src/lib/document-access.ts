import { DocumentOwnerScope, UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type DocumentScope = "CLIENT" | "ADMIN";

export function parseDocumentScope(value: string | null): DocumentOwnerScope | null {
  if (value === "CLIENT" || value === "ADMIN") return value;
  return null;
}

export function uploadScopeForRole(role: UserRole): DocumentOwnerScope {
  return role === UserRole.CLIENT ? DocumentOwnerScope.CLIENT : DocumentOwnerScope.ADMIN;
}

export function canManageScope(role: UserRole, scope: DocumentOwnerScope): boolean {
  if (role === UserRole.ADMIN || role === UserRole.STAFF) return true;
  return scope === DocumentOwnerScope.CLIENT;
}

export async function requireDocumentSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" as const, status: 401 as const };
  }
  return { session };
}

export async function resolveClientUserId(
  role: UserRole,
  sessionUserId: string,
  requestedUserId: string | null
): Promise<{ userId: string } | { error: string; status: number }> {
  if (role === UserRole.CLIENT) {
    return { userId: sessionUserId };
  }
  if (role === UserRole.ADMIN || role === UserRole.STAFF) {
    if (!requestedUserId) {
      return { error: "Select a client", status: 400 };
    }
    const owner = await prisma.user.findUnique({
      where: { id: requestedUserId },
      select: { id: true, role: true },
    });
    if (!owner || owner.role !== UserRole.CLIENT) {
      return { error: "Client not found", status: 400 };
    }
    return { userId: owner.id };
  }
  return { error: "Forbidden", status: 403 };
}

export async function getFolderForUser(
  folderId: string,
  userId: string
) {
  return prisma.documentFolder.findFirst({
    where: { id: folderId, userId },
  });
}
