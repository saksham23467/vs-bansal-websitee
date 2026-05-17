import { NextResponse } from "next/server";
import { DocumentOwnerScope, Prisma, UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MAX_DOCUMENT_BYTES,
  resolveMimeType,
} from "@/lib/documents";
import {
  getFolderForUser,
  parseDocumentScope,
  resolveClientUserId,
  uploadScopeForRole,
} from "@/lib/document-access";
import { assertStorageConfigured, storeDocumentFile } from "@/lib/document-storage";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const role = session.user.role as UserRole;
  const scope = parseDocumentScope(searchParams.get("scope"));
  const folderIdParam = searchParams.get("folderId");

  const resolved = await resolveClientUserId(
    role,
    session.user.id,
    searchParams.get("userId")
  );
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: resolved.status });
  }

  const folderId =
    folderIdParam === null || folderIdParam === "" || folderIdParam === "root"
      ? null
      : folderIdParam;

  if (!scope) {
    return NextResponse.json({ error: "scope is required (CLIENT or ADMIN)" }, { status: 400 });
  }

  if (folderId) {
    const folder = await getFolderForUser(folderId, resolved.userId);
    if (!folder || folder.scope !== scope) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
  }

  const documents = await prisma.document.findMany({
    where: {
      userId: resolved.userId,
      scope,
      folderId,
    },
    orderBy: { uploadedAt: "desc" },
    select: {
      id: true,
      title: true,
      fileName: true,
      fileType: true,
      fileSize: true,
      category: true,
      scope: true,
      folderId: true,
      uploadedAt: true,
    },
  });

  return NextResponse.json({ documents });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as UserRole;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const title = formData.get("title");
  const category = formData.get("category");
  const file = formData.get("file");
  const requestedUserId = formData.get("userId");
  const folderIdRaw = formData.get("folderId");
  const scopeRaw = formData.get("scope");

  const uploadScope = uploadScopeForRole(role);
  const scopeParam = typeof scopeRaw === "string" ? parseDocumentScope(scopeRaw) : null;
  const scope: DocumentOwnerScope = scopeParam ?? uploadScope;

  if (role === UserRole.CLIENT && scope !== DocumentOwnerScope.CLIENT) {
    return NextResponse.json(
      { error: "Clients can only upload to their own uploads folder" },
      { status: 403 }
    );
  }

  const resolved = await resolveClientUserId(
    role,
    session.user.id,
    typeof requestedUserId === "string" ? requestedUserId : null
  );
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: resolved.status });
  }

  const targetUserId = resolved.userId;

  const folderId =
    typeof folderIdRaw === "string" && folderIdRaw && folderIdRaw !== "root"
      ? folderIdRaw
      : null;

  if (typeof title !== "string" || title.trim().length < 2) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (folderId) {
    const folder = await getFolderForUser(folderId, targetUserId);
    if (!folder || folder.scope !== scope) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
  }

  if (file.size > MAX_DOCUMENT_BYTES) {
    return NextResponse.json({ error: "File must be under 15 MB" }, { status: 400 });
  }

  const mimeType = resolveMimeType(file);
  if (!mimeType) {
    return NextResponse.json(
      {
        error:
          "File type not allowed. Use PDF, ZIP, images, Excel, Word, CSV, or TXT.",
      },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name || "document";

  try {
    assertStorageConfigured();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return NextResponse.json(
      {
        error:
          msg.includes("BLOB_MISSING")
            ? "File storage not set up on Vercel. Go to your Vercel project → Storage → Create Blob Store → Connect to project, then redeploy."
            : "Storage not configured.",
      },
      { status: 503 }
    );
  }

  let document;
  try {
    document = await prisma.document.create({
      data: {
        title: title.trim(),
        fileName,
        fileUrl: "",
        storageKey: "",
        fileType: mimeType,
        fileSize: file.size,
        category: typeof category === "string" && category ? category : null,
        userId: targetUserId,
        scope,
        folderId,
      },
    });
  } catch (error) {
    console.error("Document DB create error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return NextResponse.json(
        {
          error:
            "Document tables not ready. In Neon SQL Editor, run prisma/folder-migration.sql then try again.",
        },
        { status: 503 }
      );
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        {
          error:
            "Database not connected. Add DATABASE_URL in Vercel → Settings → Environment Variables (Neon pooled URL), then redeploy.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Could not save document. Check database setup." },
      { status: 500 }
    );
  }

  try {
    const stored = await storeDocumentFile(
      targetUserId,
      scope,
      folderId,
      document.id,
      fileName,
      buffer,
      mimeType
    );

    const updated = await prisma.document.update({
      where: { id: document.id },
      data: {
        storageKey: stored.storageKey,
        fileUrl: stored.fileUrl,
      },
    });

    return NextResponse.json({ document: updated }, { status: 201 });
  } catch (error) {
    await prisma.document.delete({ where: { id: document.id } }).catch(() => {});
    console.error("Document upload error:", error);
    const message =
      error instanceof Error && error.message.includes("BLOB_MISSING")
        ? "Add Vercel Blob: Project → Storage → Create Blob → Connect → Redeploy."
        : error instanceof Error
          ? `Upload failed: ${error.message}`
          : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
