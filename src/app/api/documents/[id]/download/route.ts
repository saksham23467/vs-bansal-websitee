import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessDocument } from "@/lib/documents";
import { readDocumentFile } from "@/lib/document-storage";
import type { UserRole } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    !canAccessDocument(
      session.user.role as UserRole,
      session.user.id,
      document.userId
    )
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buffer = await readDocumentFile(document.storageKey);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": document.fileType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(document.fileName)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Document download error:", error);
    return NextResponse.json({ error: "File unavailable" }, { status: 500 });
  }
}
