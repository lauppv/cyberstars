-- When the user finished the first-lesson tour. NULL holds a new account on
-- the tour lesson until its tests pass. Accounts that existed before the tour
-- count as onboarded already, so only new sign-ups go through it.
ALTER TABLE "users" ADD COLUMN "onboarded_at" TIMESTAMP(3);
UPDATE "users" SET "onboarded_at" = "created_at";
