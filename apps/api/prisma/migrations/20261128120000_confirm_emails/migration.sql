-- Emails are one account whatever their case (CYB-135). The founder's role
-- went to any sign-up whose email matched FOUNDER_EMAIL once lowercased, while
-- the unique index told `Ana@x.com` from `ana@x.com`, so a second account could
-- take it. Two accounts that differ only by case stop this migration on the
-- unique index: list them first and decide by hand.
UPDATE "users" SET "email" = lower(trim("email")) WHERE "email" <> lower(trim("email"));
UPDATE "users" SET "pending_email" = lower(trim("pending_email"))
WHERE "pending_email" <> lower(trim("pending_email"));
ALTER TABLE "users" ADD CONSTRAINT "users_email_lowercase" CHECK ("email" = lower("email"));

-- A new account's email is confirmed by a link; the accounts made before are
-- asked to confirm theirs too, so every one starts unconfirmed
ALTER TABLE "users"
    ADD COLUMN "email_confirmed_at" TIMESTAMP(3),
    ADD COLUMN "confirm_token_hash" VARCHAR(64),
    ADD COLUMN "confirm_token_expires_at" TIMESTAMP(3);

CREATE UNIQUE INDEX "users_confirm_token_hash_key" ON "users"("confirm_token_hash");
