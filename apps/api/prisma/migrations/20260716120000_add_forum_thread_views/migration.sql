-- CreateTable
CREATE TABLE "forum_thread_views" (
    "id" SERIAL NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "viewer_key" VARCHAR(80) NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_thread_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "forum_thread_views_thread_id_idx" ON "forum_thread_views"("thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "forum_thread_views_thread_id_viewer_key_key" ON "forum_thread_views"("thread_id", "viewer_key");

-- AddForeignKey
ALTER TABLE "forum_thread_views" ADD CONSTRAINT "forum_thread_views_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
