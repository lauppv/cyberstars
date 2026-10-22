-- How many tries the current reset code has taken, from all IPs together; at
-- five it stops working (CYB-88). A new code starts again from 0.
ALTER TABLE "users" ADD COLUMN "reset_code_attempts" INTEGER NOT NULL DEFAULT 0;
