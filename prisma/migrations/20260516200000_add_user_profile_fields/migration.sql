-- AlterTable
ALTER TABLE "users" ADD COLUMN "avatar_url" VARCHAR(512);
ALTER TABLE "users" ADD COLUMN "bio" VARCHAR(200);
ALTER TABLE "users" ADD COLUMN "status" VARCHAR(80);
ALTER TABLE "users" ADD COLUMN "status_expires_at" TIMESTAMP(3);
