-- CreateTable
CREATE TABLE "dm_reactions" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emoji" VARCHAR(10) NOT NULL,

    CONSTRAINT "dm_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dm_reactions_message_id_idx" ON "dm_reactions"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "dm_reactions_message_id_user_id_emoji_key" ON "dm_reactions"("message_id", "user_id", "emoji");

-- AddForeignKey
ALTER TABLE "dm_reactions" ADD CONSTRAINT "dm_reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "direct_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dm_reactions" ADD CONSTRAINT "dm_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
