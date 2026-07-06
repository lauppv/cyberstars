-- AlterTable
ALTER TABLE "users" ADD COLUMN "pending_email" VARCHAR(255),
ADD COLUMN "email_change_code" VARCHAR(6),
ADD COLUMN "email_change_code_expires_at" TIMESTAMP(3);
