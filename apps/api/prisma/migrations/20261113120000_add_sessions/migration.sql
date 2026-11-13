-- Sessions kept on the server, one row per signed-in browser, in place of
-- signed tokens checked against a version on the account. Every token made
-- before is no longer accepted, so everyone signs in again once
CREATE TABLE "sessions" (
    "id" VARCHAR(22) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "secret_hash" CHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "last_seen_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_last_seen_at_idx" ON "sessions"("last_seen_at");

-- CreateIndex
CREATE INDEX "sessions_created_at_idx" ON "sessions"("created_at");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- The version a password change raised to end every token; deleting the
-- account's sessions does it now
ALTER TABLE "users" DROP COLUMN "session_version";
