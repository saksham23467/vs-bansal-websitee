import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { deleteDocumentFile } from "@/lib/document-storage";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const lines = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    const arr = Array.isArray(value) ? value : value.split("\n");
    return arr.map((s) => s.trim()).filter(Boolean);
  });

const updateSchema = z.object({
  title: z.string().min(2).max(160).optional(),
  location: z.string().min(2).max(120).optional(),
  type: z
    .enum(["INTERNSHIP", "ARTICLESHIP", "FULL_TIME", "PART_TIME", "CONTRACT"])
    .optional(),
  duration: z.string().max(120).optional().nullable(),
  experience: z.string().max(120).optional().nullable(),
  compensation: z.string().max(160).optional().nullable(),
  overview: z.string().min(10).max(4000).optional(),
  responsibilities: lines,
  requirements: lines,
  preferred: lines,
  benefits: lines,
  exposureAreas: lines,
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]).optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const { id } = await params;
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 422 }
    );
  }

  const d = parsed.data;
  const job = await prisma.job.update({
    where: { id },
    data: {
      title: d.title?.trim(),
      location: d.location?.trim(),
      type: d.type,
      duration: d.duration === undefined ? undefined : d.duration?.trim() || null,
      experience:
        d.experience === undefined ? undefined : d.experience?.trim() || null,
      compensation:
        d.compensation === undefined ? undefined : d.compensation?.trim() || null,
      overview: d.overview?.trim(),
      responsibilities: d.responsibilities,
      requirements: d.requirements,
      preferred: d.preferred,
      benefits: d.benefits,
      exposureAreas: d.exposureAreas,
      status: d.status,
      order: d.order,
    },
  });

  return NextResponse.json({ job });
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { applications: { select: { resumeKey: true } } },
  });
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Remove resume files for this job's applications before deleting records.
  await Promise.allSettled(
    job.applications.map((a) => deleteDocumentFile(a.resumeKey))
  );

  await prisma.jobApplication.deleteMany({ where: { jobId: id } });
  await prisma.job.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
