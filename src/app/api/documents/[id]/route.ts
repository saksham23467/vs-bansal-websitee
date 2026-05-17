import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessDocument } from "@/lib/documents";
import { deleteDocumentFile } from "@/lib/document-storage";
import type { UserRole } from "@prisma/client";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const role = session.user.role as UserRole;

  if (
    !canAccessDocument(role, session.user.id, document.userId)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (role === "CLIENT" && document.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteDocumentFile(document.storageKey);
  await prisma.document.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
