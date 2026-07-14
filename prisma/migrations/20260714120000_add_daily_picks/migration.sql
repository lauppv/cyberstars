-- CreateTable
CREATE TABLE "daily_picks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "kind" VARCHAR(10) NOT NULL,
    "course_key" VARCHAR(50) NOT NULL,
    "lesson_slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "bonus_awarded" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_picks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "daily_picks_user_id_course_key_idx" ON "daily_picks"("user_id", "course_key");

-- CreateIndex
CREATE UNIQUE INDEX "daily_picks_user_id_date_kind_key" ON "daily_picks"("user_id", "date", "kind");

-- AddForeignKey
ALTER TABLE "daily_picks" ADD CONSTRAINT "daily_picks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
