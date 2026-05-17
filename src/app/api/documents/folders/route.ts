import { NextResponse } from "next/server";
import { DocumentOwnerScope, Prisma, UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  canManageScope,
  getFolderForUser,
  parseDocumentScope,
  requireDocumentSession,
  resolveClientUserId,
} from "@/lib/document-access";

export const runtime = "nodejs";

const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(80),
  scope: z.enum(["CLIENT", "ADMIN"]),
  parentId: z.string().optional().nullable(),
  userId: z.string().optional(),
});

export async function GET(req: Request) {
  const authResult = await requireDocumentSession();
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const role = authResult.session.user.role as UserRole;
  const { searchParams } = new URL(req.url);
  const scope = parseDocumentScope(searchParams.get("scope"));
  const parentId = searchParams.get("parentId");
  const parentFilter =
    parentId === null || parentId === ""
      ? null
      : parentId === "root"
        ? null
        : parentId;

  if (!scope) {
    return NextResponse.json({ error: "scope is required (CLIENT or ADMIN)" }, { status: 400 });
  }

  const resolved = await resolveClientUserId(
    role,
    authResult.session.user.id,
    searchParams.get("userId")
  );
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: resolved.status });
  }

  if (parentFilter) {
    const parent = await getFolderForUser(parentFilter, resolved.userId);
    if (!parent || parent.scope !== scope) {
      return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
    }
  }

  const folders = await prisma.documentFolder.findMany({
    where: {
      userId: resolved.userId,
      scope,
      parentId: parentFilter,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      parentId: true,
      scope: true,
      createdAt: true,
      _count: { select: { documents: true, children: true } },
    },
  });

  return NextResponse.json({ folders });
}

export async function POST(req: Request) {
  const authResult = await requireDocumentSession();
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const role = authResult.session.user.role as UserRole;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createFolderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 422 }
    );
  }

  const scope = parsed.data.scope as DocumentOwnerScope;

  if (!canManageScope(role, scope)) {
    return NextResponse.json(
      { error: "You can only create folders in your own uploads area" },
      { status: 403 }
    );
  }

  const resolved = await resolveClientUserId(
    role,
    authResult.session.user.id,
    parsed.data.userId ?? null
  );
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: resolved.status });
  }

  const name = parsed.data.name.trim();
  const parentId = parsed.data.parentId || null;

  if (parentId) {
    const parent = await getFolderForUser(parentId, resolved.userId);
    if (!parent || parent.scope !== scope) {
      return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
    }
  }

  const duplicate = await prisma.documentFolder.findFirst({
    where: {
      userId: resolved.userId,
      scope,
      parentId,
      name: { equals: name, mode: "insensitive" },
    },
  });
  if (duplicate) {
    return NextResponse.json({ error: "A folder with this name already exists here" }, { status: 409 });
  }

  try {
    const folder = await prisma.documentFolder.create({
      data: {
        name,
        userId: resolved.userId,
        scope,
        parentId,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
        scope: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return NextResponse.json(
        { error: "Run prisma/folder-migration.sql in Neon, then try again." },
        { status: 503 }
      );
    }
    console.error("Create folder error:", error);
    return NextResponse.json({ error: "Could not create folder" }, { status: 500 });
  }
}
