-- The project steps each student ticked off as done
CREATE TABLE "project_step_checks" (
    "user_id" INTEGER NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "project_slug" VARCHAR(100) NOT NULL,
    "step_id" VARCHAR(50) NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_step_checks_pkey" PRIMARY KEY ("user_id","language","project_slug","step_id")
);

-- AddForeignKey
ALTER TABLE "project_step_checks" ADD CONSTRAINT "project_step_checks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
