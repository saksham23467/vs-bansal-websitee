-- Run in Neon SQL Editor AFTER prisma/neon-setup.sql (or after npx prisma db push)
-- Creates admin + client login accounts

INSERT INTO "User" ("id", "name", "email", "emailVerified", "passwordHash", "role", "company", "createdAt", "updatedAt")
VALUES (
  'admin_seed_001',
  'Portal Admin',
  'admin@vsbansalassociates.com',
  NOW(),
  '$2b$12$VZHRpxuLj2GxBOK8LdEa3.4KEYYUt7iGaRit9BJHIllhsWHqR627K',
  'ADMIN',
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = 'ADMIN',
  "updatedAt" = NOW();

INSERT INTO "User" ("id", "name", "email", "emailVerified", "passwordHash", "role", "company", "createdAt", "updatedAt")
VALUES (
  'client_seed_001',
  'Sample Client',
  'client@vsbansalassociates.com',
  NOW(),
  '$2b$12$bMpxdH1DJKAI.f1lXSGijOOJx/o//CiGAKpySvE2xziV/RwTqgsfW',
  'CLIENT',
  'Sample Trading Pvt Ltd',
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = 'CLIENT',
  "updatedAt" = NOW();
