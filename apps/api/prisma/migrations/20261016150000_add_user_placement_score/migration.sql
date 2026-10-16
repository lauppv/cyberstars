-- Right answers out of 12 on the landing page's placement test, taken before
-- signing up. Accounts that signed up without it, the existing ones too, keep
-- NULL.
ALTER TABLE "users" ADD COLUMN "placement_score" SMALLINT;
