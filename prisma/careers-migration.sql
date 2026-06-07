-- Careers module: run in Neon SQL Editor (idempotent-ish; safe to run once)

-- Enums
DO $$ BEGIN
  CREATE TYPE "JobType" AS ENUM ('INTERNSHIP', 'ARTICLESHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED', 'DRAFT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Job table
CREATE TABLE IF NOT EXISTS "Job" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'Delhi NCR',
    "type" "JobType" NOT NULL DEFAULT 'FULL_TIME',
    "duration" TEXT,
    "experience" TEXT,
    "compensation" TEXT,
    "overview" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "requirements" TEXT[],
    "preferred" TEXT[],
    "benefits" TEXT[],
    "exposureAreas" TEXT[],
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Job_slug_key" ON "Job"("slug");
CREATE INDEX IF NOT EXISTS "Job_status_idx" ON "Job"("status");

-- JobApplication table
CREATE TABLE IF NOT EXISTS "JobApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "positionTitle" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "experience" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "resumeKey" TEXT NOT NULL,
    "resumeName" TEXT NOT NULL,
    "linkedin" TEXT,
    "coverLetter" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "JobApplication_jobId_idx" ON "JobApplication"("jobId");
CREATE INDEX IF NOT EXISTS "JobApplication_status_idx" ON "JobApplication"("status");

DO $$ BEGIN
  ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed the three default positions (skips if slug already exists)
INSERT INTO "Job" ("id", "slug", "title", "location", "type", "duration", "compensation", "overview", "responsibilities", "requirements", "preferred", "benefits", "exposureAreas", "status", "order", "createdAt", "updatedAt")
VALUES
(
  'job_seed_ca_intern',
  'ca-intern',
  'CA Intern',
  'Delhi NCR',
  'INTERNSHIP',
  '3-6 Months',
  '₹12,000 - ₹20,000 per month',
  'We are seeking motivated commerce students and aspiring Chartered Accountants who want practical exposure to taxation, GST compliance, accounting, and financial advisory.',
  ARRAY['Assist in GST return preparation','Support bookkeeping activities','Help prepare tax computations','Perform basic financial analysis','Assist with statutory filings','Work with senior consultants on client engagements'],
  ARRAY['B.Com/BBA student or graduate','Strong understanding of accounting fundamentals','Knowledge of Tally, Zoho Books, or Excel','Good communication skills','Attention to detail'],
  ARRAY['Basic GST knowledge','Familiarity with accounting software'],
  ARRAY['Practical industry exposure','Mentorship from experienced CAs','Certificate of completion','Potential PPO opportunity'],
  ARRAY[]::TEXT[],
  'OPEN',
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'job_seed_ca_articleship',
  'ca-articleship-trainee',
  'CA Articleship Trainee',
  'Delhi NCR',
  'ARTICLESHIP',
  'As per ICAI Guidelines',
  '₹15,000 - ₹30,000 per month',
  'We are looking for ambitious CA Intermediate candidates seeking Articleship training with exposure to taxation, audit, compliance, financial reporting, and advisory assignments.',
  ARRAY['Assist in statutory audits','Assist in tax audits','GST compliance and advisory','ROC filings and corporate compliance','Preparation of financial statements','Client documentation and reporting','Due diligence support'],
  ARRAY['Cleared CA Intermediate (Both Groups preferred)','Strong accounting and auditing knowledge','Proficiency in MS Excel','Good analytical skills','Strong communication skills'],
  ARRAY[]::TEXT[],
  ARRAY['Comprehensive ICAI Articleship exposure','Hands-on client interaction','Mentorship by senior CAs','Opportunity to work with startups and SMEs'],
  ARRAY['Direct Tax','Indirect Tax','Audit & Assurance','Financial Reporting','Startup Advisory','Compliance Services'],
  'OPEN',
  2,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'job_seed_ca_full_time',
  'chartered-accountant',
  'Chartered Accountant (CA)',
  'Delhi NCR',
  'FULL_TIME',
  NULL,
  '₹8 LPA - ₹15 LPA',
  'We are seeking a qualified Chartered Accountant to lead client engagements, manage taxation and compliance matters, and provide strategic financial advisory services.',
  ARRAY['Manage GST and income tax matters','Review financial statements','Conduct tax planning and advisory','Handle client relationships','Lead audit engagements','Ensure regulatory compliance','Mentor interns and article trainees'],
  ARRAY['Qualified Chartered Accountant','2-5 years post qualification experience','Strong knowledge of Indian taxation laws','Experience in audits and compliance','Advanced Excel skills','Excellent communication skills'],
  ARRAY['Startup advisory experience','Virtual CFO experience','ROC compliance knowledge'],
  ARRAY['Competitive compensation','Professional development support','Leadership opportunities','Exposure to diverse industries','Performance incentives'],
  ARRAY[]::TEXT[],
  'OPEN',
  3,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;

-- The full-time CA role uses experience instead of duration
UPDATE "Job" SET "experience" = '2-5 Years' WHERE "slug" = 'chartered-accountant';
