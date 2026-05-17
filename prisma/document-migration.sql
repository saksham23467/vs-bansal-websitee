-- Run in Neon SQL Editor if you already created tables from an older neon-setup.sql

ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "fileName" TEXT;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "storageKey" TEXT;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "fileSize" INTEGER;

UPDATE "Document"
SET
  "fileName" = COALESCE("fileName", "title", 'document'),
  "storageKey" = COALESCE("storageKey", "fileUrl", 'legacy/' || "id")
WHERE "fileName" IS NULL OR "storageKey" IS NULL;

ALTER TABLE "Document" ALTER COLUMN "fileName" SET NOT NULL;
ALTER TABLE "Document" ALTER COLUMN "storageKey" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "Document_userId_idx" ON "Document"("userId");
