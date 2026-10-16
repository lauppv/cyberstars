-- What the student wants to learn, asked once on the screen after the tour.
-- NULL interests_at sends a new account there; accounts that existed before
-- count as asked already, so only new sign-ups see it.
ALTER TABLE "users" ADD COLUMN "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "interests_at" TIMESTAMP(3);
UPDATE "users" SET "interests_at" = "created_at";
