-- How many opened each poll, so the admins see how many ignored it; the polls
-- already sent get false, as nobody counted who opened them
ALTER TABLE "polls" ADD COLUMN "viewers" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "polls" ADD COLUMN "counts_viewers" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "polls" ALTER COLUMN "counts_viewers" SET DEFAULT true;

-- CreateTable
CREATE TABLE "poll_viewers" (
    "poll_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "poll_viewers_pkey" PRIMARY KEY ("poll_id","user_id")
);

-- AddForeignKey
ALTER TABLE "poll_viewers" ADD CONSTRAINT "poll_viewers_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_viewers" ADD CONSTRAINT "poll_viewers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
