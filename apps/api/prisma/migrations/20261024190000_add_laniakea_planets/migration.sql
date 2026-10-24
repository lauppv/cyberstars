-- Laniakea: a student's planets, one per lesson of the game's course, with how
-- far each has moved and the test going on.
CREATE TABLE "laniakea_planets" (
    "user_id" INTEGER NOT NULL,
    "course_key" VARCHAR(50) NOT NULL,
    "lesson_slug" VARCHAR(100) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "passed_at" TIMESTAMP(3),
    "retry_at" TIMESTAMP(3),
    "seen" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "quiz" JSONB,
    "quiz_at" TIMESTAMP(3),

    CONSTRAINT "laniakea_planets_pkey" PRIMARY KEY ("user_id","course_key","lesson_slug")
);

ALTER TABLE "laniakea_planets" ADD CONSTRAINT "laniakea_planets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
