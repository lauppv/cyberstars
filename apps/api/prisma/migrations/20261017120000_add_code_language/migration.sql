-- The language a student's code is in, for courses that teach every lesson in
-- Python, Java and C (MULTI_LANGUAGE_COURSE_KEYS).
-- The language they picked last, which every lesson of such a course opens in;
-- NULL until they pick one, which opens Python.
ALTER TABLE "users" ADD COLUMN "code_language" VARCHAR(10);

-- Saved code is kept per language there, so switching to C and back keeps the
-- Python code. A course with one language keeps its rows under ''.
ALTER TABLE "user_saved_code" ADD COLUMN "language" VARCHAR(10) NOT NULL DEFAULT '';
DROP INDEX "user_saved_code_user_id_course_key_lesson_slug_key";
CREATE UNIQUE INDEX "user_saved_code_user_id_course_key_lesson_slug_language_key" ON "user_saved_code"("user_id", "course_key", "lesson_slug", "language");

-- The language every attempt ran in. Until now each course had one, which its
-- key names (algo-python ran Python).
ALTER TABLE "lesson_submissions" ADD COLUMN "language" VARCHAR(10);
UPDATE "lesson_submissions" SET "language" = regexp_replace("course_key", '^algo-', '');
ALTER TABLE "lesson_submissions" ALTER COLUMN "language" SET NOT NULL;
