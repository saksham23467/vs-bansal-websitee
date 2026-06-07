import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

const jobTypeEnum = z.enum([
  "INTERNSHIP",
  "ARTICLESHIP",
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
]);
const jobStatusEnum = z.enum(["OPEN", "CLOSED", "DRAFT"]);

const lines = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (!value) return [] as string[];
    const arr = Array.isArray(value) ? value : value.split("\n");
    return arr.map((s) => s.trim()).filter(Boolean);
  });

const jobSchema = z.object({
  title: z.string().min(2, "Title is required").max(160),
  location: z.string().min(2).max(120).default("Delhi NCR"),
  type: jobTypeEnum.default("FULL_TIME"),
  duration: z.string().max(120).optional().nullable(),
  experience: z.string().max(120).optional().nullable(),
  compensation: z.string().max(160).optional().nullable(),
  overview: z.string().min(10, "Add a short overview").max(4000),
  responsibilities: lines,
  requirements: lines,
  preferred: lines,
  benefits: lines,
  exposureAreas: lines,
  status: jobStatusEnum.default("OPEN"),
  order: z.coerce.number().int().min(0).default(0),
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const jobs = await prisma.job.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { applications: true } } },
  });

  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 422 }
    );
  }

  const d = parsed.data;
  const base = slugify(d.title) || "job";
  let slug = base;
  let n = 1;
  // ensure unique slug
  while (await prisma.job.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }

  const job = await prisma.job.create({
    data: {
      slug,
      title: d.title.trim(),
      location: d.location.trim(),
      type: d.type,
      duration: d.duration?.trim() || null,
      experience: d.experience?.trim() || null,
      compensation: d.compensation?.trim() || null,
      overview: d.overview.trim(),
      responsibilities: d.responsibilities,
      requirements: d.requirements,
      preferred: d.preferred,
      benefits: d.benefits,
      exposureAreas: d.exposureAreas,
      status: d.status,
      order: d.order,
    },
  });

  return NextResponse.json({ job }, { status: 201 });
}
