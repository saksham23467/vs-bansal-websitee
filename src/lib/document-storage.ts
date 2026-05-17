import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, get, put } from "@vercel/blob";
import { buildStorageKey } from "@/lib/documents";

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const isVercel = Boolean(process.env.VERCEL);

function localPath(storageKey: string) {
  return path.join(process.cwd(), "private", "uploads", storageKey);
}

export function assertStorageConfigured() {
  if (isVercel && !useBlob) {
    throw new Error(
      "BLOB_MISSING: Add Vercel Blob storage to this project (Storage → Create Blob → Connect)."
    );
  }
}

export async function storeDocumentFile(
  userId: string,
  documentId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ storageKey: string; fileUrl: string }> {
  assertStorageConfigured();

  const storageKey = buildStorageKey(userId, documentId, fileName);

  if (useBlob) {
    const blob = await put(storageKey, buffer, {
      access: "private",
      contentType: mimeType,
      addRandomSuffix: false,
    });
    return { storageKey, fileUrl: blob.url };
  }

  const fullPath = localPath(storageKey);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, buffer);
  return { storageKey, fileUrl: `/api/documents/${documentId}/download` };
}

export async function readDocumentFile(storageKey: string): Promise<Buffer> {
  if (useBlob) {
    const result = await get(storageKey, { access: "private", useCache: false });
    if (!result?.stream) throw new Error("Blob not found");
    const chunks: Uint8Array[] = [];
    const reader = result.stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    return Buffer.concat(chunks);
  }

  return readFile(localPath(storageKey));
}

export async function deleteDocumentFile(storageKey: string) {
  if (useBlob) {
    await del(storageKey);
    return;
  }
  try {
    const { unlink } = await import("node:fs/promises");
    await unlink(localPath(storageKey));
  } catch {
    /* file may already be gone */
  }
}
