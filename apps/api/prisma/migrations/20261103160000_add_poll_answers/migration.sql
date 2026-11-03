-- A poll's Other, whose voters write their own answer, and those answers, never who wrote them
ALTER TABLE "poll_options" ADD COLUMN "write_in" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "poll_answers" (
    "id" SERIAL NOT NULL,
    "poll_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "poll_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "poll_answers_poll_id_idx" ON "poll_answers"("poll_id");

-- AddForeignKey
ALTER TABLE "poll_answers" ADD CONSTRAINT "poll_answers_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
