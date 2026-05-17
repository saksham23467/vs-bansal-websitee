import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MAX_DOCUMENT_BYTES,
  resolveMimeType,
} from "@/lib/documents";
import { storeDocumentFile } from "@/lib/document-storage";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const forUserId = searchParams.get("userId");

  const role = session.user.role as UserRole;

  if (forUserId && role !== UserRole.ADMIN && role !== UserRole.STAFF) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId =
    role === UserRole.CLIENT ? session.user.id : (forUserId ?? session.user.id);

  const documents = await prisma.document.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
    select: {
      id: true,
      title: true,
      fileName: true,
      fileType: true,
      fileSize: true,
      category: true,
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

  let targetUserId: string;

  if (role === UserRole.CLIENT) {
    targetUserId = session.user.id;
  } else if (role === UserRole.ADMIN || role === UserRole.STAFF) {
    if (typeof requestedUserId !== "string" || !requestedUserId) {
      return NextResponse.json({ error: "Select a client" }, { status: 400 });
    }
    targetUserId = requestedUserId;
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (typeof title !== "string" || title.trim().length < 2) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const owner = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true },
  });

  if (!owner) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  if (role === UserRole.CLIENT && owner.id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (role !== UserRole.CLIENT && owner.role !== UserRole.CLIENT) {
    return NextResponse.json({ error: "Documents must belong to a client account" }, { status: 400 });
  }

  if (file.size > MAX_DOCUMENT_BYTES) {
    return NextResponse.json({ error: "File must be under 15 MB" }, { status: 400 });
  }

  const mimeType = resolveMimeType(file);
  if (!mimeType) {
    return NextResponse.json(
      { error: "File type not allowed. Use PDF, images, Excel, Word, CSV, or TXT." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name || "document";

  const document = await prisma.document.create({
    data: {
      title: title.trim(),
      fileName,
      fileUrl: "",
      storageKey: "",
      fileType: mimeType,
      fileSize: file.size,
      category: typeof category === "string" && category ? category : null,
      userId: targetUserId,
    },
  });

  try {
    const stored = await storeDocumentFile(
      targetUserId,
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
      error instanceof Error && error.message.includes("BLOB")
        ? "File storage not configured. Add Vercel Blob on production."
        : "Upload failed. Check database connection and try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
