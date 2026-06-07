import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CareersManager, type AdminJob } from "@/components/admin/careers-manager";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Careers management",
  description: "Manage job postings",
  path: "/portal/admin/careers",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function PortalAdminCareersPage() {
  let jobs: AdminJob[] = [];
  let migrationNeeded = false;

  try {
    const dbJobs = await prisma.job.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    jobs = dbJobs.map((j) => ({
      id: j.id,
      slug: j.slug,
      title: j.title,
      location: j.location,
      type: j.type,
      duration: j.duration,
      experience: j.experience,
      compensation: j.compensation,
      overview: j.overview,
      responsibilities: j.responsibilities,
      requirements: j.requirements,
      preferred: j.preferred,
      benefits: j.benefits,
      exposureAreas: j.exposureAreas,
      status: j.status,
      order: j.order,
    }));
  } catch (error) {
    console.error("Careers admin load error:", error);
    migrationNeeded = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Careers management</h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          Add and edit job postings and change their status. Candidate applications
          are emailed to you directly (with the resume attached) — they are not
          stored in the portal.
        </p>
      </div>

      {migrationNeeded ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          The careers database table doesn&apos;t exist yet. Run{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono">
            prisma/careers-migration.sql
          </code>{" "}
          in your Neon SQL editor, then reload this page.
        </div>
      ) : (
        <CareersManager initialJobs={jobs} />
      )}

      <Button asChild variant="outline">
        <Link href="/portal/admin">Back to admin overview</Link>
      </Button>
    </div>
  );
}
