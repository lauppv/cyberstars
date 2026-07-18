-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "show_bio" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "show_stats" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "show_progress" BOOLEAN NOT NULL DEFAULT true;
