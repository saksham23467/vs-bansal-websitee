import type { JobStatus, JobType } from "@prisma/client";

export type CareerJob = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: JobType;
  duration: string | null;
  experience: string | null;
  compensation: string | null;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  benefits: string[];
  exposureAreas: string[];
  status: JobStatus;
  order: number;
};

export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  INTERNSHIP: "Internship",
  ARTICLESHIP: "Articleship",
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
};

export const JOB_TYPES: { value: JobType; label: string }[] = (
  Object.keys(JOB_TYPE_LABELS) as JobType[]
).map((value) => ({ value, label: JOB_TYPE_LABELS[value] }));

export const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" },
  { value: "DRAFT", label: "Draft" },
];

export const APPLICATION_STATUSES = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
] as const;

export const QUALIFICATION_OPTIONS = [
  "B.Com / BBA Student",
  "B.Com / BBA Graduate",
  "CA Foundation",
  "CA Intermediate",
  "CA Final (Pursuing)",
  "Qualified Chartered Accountant",
  "M.Com / MBA",
  "Other",
] as const;

/**
 * Default positions, used as a fallback when the database has no jobs yet
 * (e.g. before running prisma/careers-migration.sql). Admins manage live
 * jobs from /portal/admin/careers once the migration is applied.
 */
export const defaultJobs: CareerJob[] = [
  {
    id: "ca-intern",
    slug: "ca-intern",
    title: "CA Intern",
    location: "Delhi NCR & Punjab",
    type: "INTERNSHIP",
    duration: "3-6 Months",
    experience: null,
    compensation: "₹25,000 - ₹30,000 per month",
    overview:
      "We are seeking motivated commerce students and aspiring Chartered Accountants who want practical exposure to taxation, GST compliance, accounting, and financial advisory.",
    responsibilities: [
      "Assist in GST return preparation",
      "Support bookkeeping activities",
      "Help prepare tax computations",
      "Perform basic financial analysis",
      "Assist with statutory filings",
      "Work with senior consultants on client engagements",
    ],
    requirements: [
      "B.Com/BBA student or graduate",
      "Strong understanding of accounting fundamentals",
      "Knowledge of Tally, Zoho Books, or Excel",
      "Good communication skills",
      "Attention to detail",
    ],
    preferred: ["Basic GST knowledge", "Familiarity with accounting software"],
    benefits: [
      "Practical industry exposure",
      "Mentorship from experienced CAs",
      "Certificate of completion",
      "Potential PPO opportunity",
    ],
    exposureAreas: [],
    status: "OPEN",
    order: 1,
  },
  {
    id: "chartered-accountant",
    slug: "chartered-accountant",
    title: "Chartered Accountant (CA)",
    location: "Delhi NCR & Punjab",
    type: "FULL_TIME",
    duration: null,
    experience: "2-5 Years",
    compensation: "₹7 LPA - ₹10 LPA",
    overview:
      "We are seeking a qualified Chartered Accountant to lead client engagements, manage taxation and compliance matters, and provide strategic financial advisory services.",
    responsibilities: [
      "Manage GST and income tax matters",
      "Review financial statements",
      "Conduct tax planning and advisory",
      "Handle client relationships",
      "Lead audit engagements",
      "Ensure regulatory compliance",
      "Mentor interns and article trainees",
    ],
    requirements: [
      "Qualified Chartered Accountant",
      "2-5 years post qualification experience",
      "Strong knowledge of Indian taxation laws",
      "Experience in audits and compliance",
      "Advanced Excel skills",
      "Excellent communication skills",
    ],
    preferred: [
      "Startup advisory experience",
      "Virtual CFO experience",
      "ROC compliance knowledge",
    ],
    benefits: [
      "Competitive compensation",
      "Professional development support",
      "Leadership opportunities",
      "Exposure to diverse industries",
      "Performance incentives",
    ],
    exposureAreas: [],
    status: "OPEN",
    order: 2,
  },
];

export function jobCompensationLabel(job: CareerJob): string | null {
  return job.compensation ?? null;
}

export function jobMetaLine(job: CareerJob): string {
  const parts = [JOB_TYPE_LABELS[job.type], job.location];
  if (job.duration) parts.push(job.duration);
  if (job.experience) parts.push(job.experience);
  return parts.filter(Boolean).join(" · ");
}
