-- Apply the latest careers changes to an existing (already-seeded) database.
-- Run this in the Neon SQL editor. Safe to run more than once.

-- CA Intern: stipend 25-30k, both offices
UPDATE "Job"
SET "compensation" = '₹25,000 - ₹30,000 per month',
    "location" = 'Delhi NCR & Punjab',
    "order" = 1,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'ca-intern';

-- Chartered Accountant: CTC 7-10 LPA, both offices
UPDATE "Job"
SET "compensation" = '₹7 LPA - ₹10 LPA',
    "location" = 'Delhi NCR & Punjab',
    "order" = 2,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'chartered-accountant';

-- Remove the Articleship position (and any applications still linked to it).
DELETE FROM "JobApplication" WHERE "jobId" IN (SELECT "id" FROM "Job" WHERE "slug" = 'ca-articleship-trainee');
DELETE FROM "Job" WHERE "slug" = 'ca-articleship-trainee';
