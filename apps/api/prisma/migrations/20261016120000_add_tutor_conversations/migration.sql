-- A student can now keep many tutor conversations. Each general conversation
-- and each lesson's becomes a conversation of its own, titled with the start of
-- its first question, before the messages point at it instead of at the student.

-- CreateTable
CREATE TABLE "tutor_conversations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_key" VARCHAR(50),
    "lesson_slug" VARCHAR(100),
    "title" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tutor_conversations_user_id_updated_at_idx" ON "tutor_conversations"("user_id", "updated_at");

-- AddForeignKey
ALTER TABLE "tutor_conversations" ADD CONSTRAINT "tutor_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- One conversation for each student's general messages and each lesson's
INSERT INTO "tutor_conversations" ("user_id", "course_key", "lesson_slug", "title", "created_at", "updated_at")
SELECT
    m."user_id",
    m."course_key",
    m."lesson_slug",
    COALESCE(
        (SELECT LEFT(REGEXP_REPLACE(BTRIM(f."text"), '\s+', ' ', 'g'), 80)
         FROM "tutor_messages" f
         WHERE f."user_id" = m."user_id"
           AND f."course_key" IS NOT DISTINCT FROM m."course_key"
           AND f."lesson_slug" IS NOT DISTINCT FROM m."lesson_slug"
           AND f."role" = 'student'
         ORDER BY f."id"
         LIMIT 1),
        ''
    ),
    MIN(m."created_at"),
    MAX(m."created_at")
FROM "tutor_messages" m
GROUP BY m."user_id", m."course_key", m."lesson_slug";

-- AlterTable
ALTER TABLE "tutor_messages" ADD COLUMN "conversation_id" INTEGER;

UPDATE "tutor_messages" m
SET "conversation_id" = c."id"
FROM "tutor_conversations" c
WHERE c."user_id" = m."user_id"
  AND c."course_key" IS NOT DISTINCT FROM m."course_key"
  AND c."lesson_slug" IS NOT DISTINCT FROM m."lesson_slug";

ALTER TABLE "tutor_messages" ALTER COLUMN "conversation_id" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "tutor_messages" DROP CONSTRAINT "tutor_messages_user_id_fkey";

-- DropIndex
DROP INDEX "tutor_messages_user_id_course_key_lesson_slug_id_idx";

-- AlterTable
ALTER TABLE "tutor_messages" DROP COLUMN "course_key",
DROP COLUMN "lesson_slug",
DROP COLUMN "user_id";

-- CreateIndex
CREATE INDEX "tutor_messages_conversation_id_id_idx" ON "tutor_messages"("conversation_id", "id");

-- AddForeignKey
ALTER TABLE "tutor_messages" ADD CONSTRAINT "tutor_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "tutor_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
