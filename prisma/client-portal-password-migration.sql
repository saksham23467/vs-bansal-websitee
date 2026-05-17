-- Run in Neon SQL Editor if User table exists without portalPassword
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "portalPassword" TEXT;
