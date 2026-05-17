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
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
]);

const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  csv: "text/csv",
  txt: "text/plain",
  zip: "application/zip",
};

export function resolveMimeType(file: File): string | null {
  if (file.type && ALLOWED_MIME_TYPES.has(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext];
  return null;
}

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

export function buildStorageKey(
  userId: string,
  scope: string,
  folderId: string | null,
  documentId: string,
  fileName: string
): string {
  const folderSegment = folderId ?? "root";
  return `documents/${userId}/${scope}/${folderSegment}/${documentId}/${sanitizeFileName(fileName)}`;
}

export const DOCUMENT_CATEGORIES = [
  "ITR",
  "GST",
  "ROC",
  "Audit",
  "Financials",
  "Agreements",
  "KYC",
  "Other",
] as const;
