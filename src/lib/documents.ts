import type { UserRole } from "@prisma/client";

export const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024; // 15 MB

export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/csv",
  "text/plain",
]);

export function canAccessDocument(
  role: UserRole,
  sessionUserId: string,
  documentUserId: string
): boolean {
  if (role === "ADMIN" || role === "STAFF") return true;
  return sessionUserId === documentUserId;
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "document";
}

export function buildStorageKey(userId: string, documentId: string, fileName: string): string {
  return `documents/${userId}/${documentId}/${sanitizeFileName(fileName)}`;
}
