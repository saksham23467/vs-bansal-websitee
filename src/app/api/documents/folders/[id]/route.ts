import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deleteDocumentFile } from "@/lib/document-storage";
import {
  canManageScope,
  requireDocumentSession,
} from "@/lib/document-access";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

async function deleteFolderTree(folderId: string, userId: string) {
  const children = await prisma.documentFolder.findMany({
    where: { parentId: folderId, userId },
    select: { id: true },
  });

  for (const child of children) {
    await deleteFolderTree(child.id, userId);
  }

  const documents = await prisma.document.findMany({
    where: { folderId },
    select: { id: true, storageKey: true },
  });

  for (const doc of documents) {
    await deleteDocumentFile(doc.storageKey).catch(() => undefined);
    await prisma.document.delete({ where: { id: doc.id } });
  }

  await prisma.documentFolder.delete({ where: { id: folderId } });
}

export async function DELETE(_req: Request, { params }: Params) {
  const authResult = await requireDocumentSession();
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const role = authResult.session.user.role as UserRole;
  const { id } = await params;

  const folder = await prisma.documentFolder.findUnique({ where: { id } });
  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  if (role === UserRole.CLIENT && folder.userId !== authResult.session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!canManageScope(role, folder.scope)) {
    return NextResponse.json(
      { error: "You can only delete folders in your own uploads area" },
      { status: 403 }
    );
  }

  if (role !== UserRole.CLIENT) {
    const owner = await prisma.user.findUnique({
      where: { id: folder.userId },
      select: { role: true },
    });
    if (!owner || owner.role !== UserRole.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    await deleteFolderTree(folder.id, folder.userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete folder error:", error);
    return NextResponse.json({ error: "Could not delete folder" }, { status: 500 });
  }
}
