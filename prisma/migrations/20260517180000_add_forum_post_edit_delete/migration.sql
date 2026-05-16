-- AlterTable
ALTER TABLE "forum_posts" ADD COLUMN "edited_by_name" VARCHAR(100);
ALTER TABLE "forum_posts" ADD COLUMN "deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "forum_posts" ADD COLUMN "deleted_by_name" VARCHAR(100);
