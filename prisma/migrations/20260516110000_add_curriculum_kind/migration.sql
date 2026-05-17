-- CreateEnum
CREATE TYPE "CurriculumKind" AS ENUM ('editor', 'terminal');

-- AlterTable
ALTER TABLE "curriculum" ADD COLUMN "kind" "CurriculumKind" NOT NULL DEFAULT 'editor';
