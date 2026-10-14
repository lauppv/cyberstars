-- CreateTable
CREATE TABLE "tutor_messages" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_key" VARCHAR(50),
    "lesson_slug" VARCHAR(100),
    "role" VARCHAR(10) NOT NULL,
    "text" TEXT NOT NULL,
    "finish" VARCHAR(12),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tutor_messages_user_id_course_key_lesson_slug_id_idx" ON "tutor_messages"("user_id", "course_key", "lesson_slug", "id");

-- AddForeignKey
ALTER TABLE "tutor_messages" ADD CONSTRAINT "tutor_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

