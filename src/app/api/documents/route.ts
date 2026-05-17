import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALLOWED_MIME_TYPES, MAX_DOCUMENT_BYTES } from "@/lib/documents";
import { storeDocumentFile } from "@/lib/document-storage";

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
  if (role !== UserRole.ADMIN && role !== UserRole.STAFF) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const userId = formData.get("userId");
  const title = formData.get("title");
  const category = formData.get("category");
  const file = formData.get("file");

  if (typeof userId !== "string" || !userId) {
    return NextResponse.json({ error: "Client is required" }, { status: 400 });
  }
  if (typeof title !== "string" || title.trim().length < 2) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const client = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!client || client.role !== UserRole.CLIENT) {
    return NextResponse.json({ error: "Invalid client" }, { status: 400 });
  }

  if (file.size > MAX_DOCUMENT_BYTES) {
    return NextResponse.json({ error: "File must be under 15 MB" }, { status: 400 });
  }

  const mimeType = file.type || "application/octet-stream";
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
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
      userId,
    },
  });

  try {
    const stored = await storeDocumentFile(
      userId,
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
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
