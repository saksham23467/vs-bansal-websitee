-- Run in Neon SQL Editor after document-migration.sql

CREATE TYPE "DocumentOwnerScope" AS ENUM ('CLIENT', 'ADMIN');

CREATE TABLE IF NOT EXISTS "DocumentFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scope" "DocumentOwnerScope" NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentFolder_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "DocumentFolder_userId_scope_idx" ON "DocumentFolder"("userId", "scope");
CREATE INDEX IF NOT EXISTS "DocumentFolder_parentId_idx" ON "DocumentFolder"("parentId");

ALTER TABLE "DocumentFolder" ADD CONSTRAINT "DocumentFolder_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DocumentFolder" ADD CONSTRAINT "DocumentFolder_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "DocumentFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "scope" "DocumentOwnerScope" NOT NULL DEFAULT 'CLIENT';
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "folderId" TEXT;

CREATE INDEX IF NOT EXISTS "Document_folderId_idx" ON "Document"("folderId");
CREATE INDEX IF NOT EXISTS "Document_userId_scope_idx" ON "Document"("userId", "scope");

ALTER TABLE "Document" ADD CONSTRAINT "Document_folderId_fkey"
  FOREIGN KEY ("folderId") REFERENCES "DocumentFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
