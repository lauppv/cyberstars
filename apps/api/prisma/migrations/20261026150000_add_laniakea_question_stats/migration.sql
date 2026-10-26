-- Laniakea: how each question does, its answers counted without who gave them,
-- for the admin's list of the most missed ones.
CREATE TABLE "laniakea_question_stats" (
    "course_key" VARCHAR(50) NOT NULL,
    "lesson_slug" VARCHAR(100) NOT NULL,
    "question_id" VARCHAR(100) NOT NULL,
    "answered" INTEGER NOT NULL DEFAULT 0,
    "wrong" INTEGER NOT NULL DEFAULT 0,
    "picks" INTEGER[] DEFAULT ARRAY[0, 0, 0, 0]::INTEGER[],

    CONSTRAINT "laniakea_question_stats_pkey" PRIMARY KEY ("course_key","lesson_slug","question_id")
);
