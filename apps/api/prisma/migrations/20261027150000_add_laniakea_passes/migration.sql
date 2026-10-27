-- Laniakea: each test that moved a planet, so the activity heatmap and the
-- streak can count them.
CREATE TABLE "laniakea_passes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_key" VARCHAR(50) NOT NULL,
    "lesson_slug" VARCHAR(100) NOT NULL,
    "passed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laniakea_passes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "laniakea_passes_user_id_idx" ON "laniakea_passes"("user_id");

ALTER TABLE "laniakea_passes" ADD CONSTRAINT "laniakea_passes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
