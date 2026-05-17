import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteDocumentFile } from "@/lib/document-storage";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const updateClientSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

function requireAdmin(role: string | undefined) {
  return role === UserRole.ADMIN || role === UserRole.STAFF;
}

async function getClientOr404(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== UserRole.CLIENT) {
    return null;
  }
  return user;
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id || !requireAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await getClientOr404(id);
  if (!existing) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 422 }
    );
  }

  const data: {
    name?: string;
    phone?: string | null;
    company?: string | null;
    passwordHash?: string;
    portalPassword?: string;
  } = {};

  if (parsed.data.name !== undefined) data.name = parsed.data.name.trim();
  if (parsed.data.phone !== undefined) data.phone = parsed.data.phone.trim() || null;
  if (parsed.data.company !== undefined) data.company = parsed.data.company.trim() || null;

  if (parsed.data.password) {
    data.passwordHash = await bcrypt.hash(parsed.data.password, 12);
    data.portalPassword = parsed.data.password;
  }

  const client = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      portalPassword: true,
      createdAt: true,
      _count: { select: { documents: true } },
    },
  });

  return NextResponse.json({ client });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id || !requireAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const existing = await getClientOr404(id);
  if (!existing) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const documents = await prisma.document.findMany({
    where: { userId: id },
    select: { storageKey: true },
  });

  await Promise.all(documents.map((d) => deleteDocumentFile(d.storageKey).catch(() => undefined)));

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
