import "server-only";
import { prisma } from "@/lib/prisma";
import { defaultJobs, type CareerJob } from "@/lib/careers-data";

type DbJob = Awaited<ReturnType<typeof prisma.job.findMany>>[number];

function mapJob(job: DbJob): CareerJob {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    location: job.location,
    type: job.type,
    duration: job.duration,
    experience: job.experience,
    compensation: job.compensation,
    overview: job.overview,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    preferred: job.preferred,
    benefits: job.benefits,
    exposureAreas: job.exposureAreas,
    status: job.status,
    order: job.order,
  };
}

/**
 * Public job listing for the careers page. Returns OPEN jobs from the database,
 * falling back to the seeded default positions if the table is empty or the
 * careers migration has not been applied yet.
 */
export async function getPublicJobs(): Promise<CareerJob[]> {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "OPEN" },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    if (jobs.length === 0) {
      return defaultJobs.filter((j) => j.status === "OPEN");
    }
    return jobs.map(mapJob);
  } catch {
    return defaultJobs.filter((j) => j.status === "OPEN");
  }
}
