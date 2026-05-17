import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, boolean | string> = {
    database: false,
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    vercel: Boolean(process.env.VERCEL),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (e) {
    checks.database = e instanceof Error ? e.message : "failed";
  }

  const ok = checks.database === true && (!checks.vercel || checks.blob === true);

  return NextResponse.json(
    {
      ok,
      checks,
      hint: !checks.blob && checks.vercel
        ? "Create Vercel Blob store and connect to this project"
        : !checks.database
          ? "Set DATABASE_URL on Vercel to your Neon pooled URL"
          : "All good",
    },
    { status: ok ? 200 : 503 }
  );
}
