-- The projects each student finished, by passing the project's judge
CREATE TABLE "project_completions" (
    "user_id" INTEGER NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "project_slug" VARCHAR(100) NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_completions_pkey" PRIMARY KEY ("user_id","language","project_slug")
);

-- AddForeignKey
ALTER TABLE "project_completions" ADD CONSTRAINT "project_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
