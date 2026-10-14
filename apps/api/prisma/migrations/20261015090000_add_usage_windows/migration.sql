-- CreateTable
CREATE TABLE "usage_windows" (
    "user_id" INTEGER NOT NULL,
    "action" VARCHAR(30) NOT NULL,
    "window_start" TIMESTAMP(3) NOT NULL,
    "used" INTEGER NOT NULL,

    CONSTRAINT "usage_windows_pkey" PRIMARY KEY ("user_id","action")
);

-- AddForeignKey
ALTER TABLE "usage_windows" ADD CONSTRAINT "usage_windows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
