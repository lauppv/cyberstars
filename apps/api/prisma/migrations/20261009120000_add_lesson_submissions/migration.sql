-- CreateTable
CREATE TABLE "lesson_submissions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_key" VARCHAR(50) NOT NULL,
    "lesson_slug" VARCHAR(100) NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "passed_count" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "runtime_ms" DOUBLE PRECISION,
    "reference_ms" DOUBLE PRECISION,
    "lang" VARCHAR(2) NOT NULL,
    "code" TEXT NOT NULL,
    "syntax_error" TEXT,
    "structure_failures" JSONB NOT NULL,
    "failed_case" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_submissions_user_id_course_key_lesson_slug_id_idx" ON "lesson_submissions"("user_id", "course_key", "lesson_slug", "id");

-- AddForeignKey
ALTER TABLE "lesson_submissions" ADD CONSTRAINT "lesson_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
