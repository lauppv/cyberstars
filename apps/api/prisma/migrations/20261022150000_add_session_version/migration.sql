-- Raised by every password change or reset; a token made at a lower version
-- no longer signs anyone in (CYB-89). Tokens from before carry none and count as 0.
ALTER TABLE "users" ADD COLUMN "session_version" INTEGER NOT NULL DEFAULT 0;
