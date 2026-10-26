-- Laniakea recaps in the bell: when each student last opened the game and when
-- they were last told of open recaps.
ALTER TYPE "NotificationType" ADD VALUE 'LANIAKEA_RECAP';

CREATE TABLE "laniakea_players" (
    "user_id" INTEGER NOT NULL,
    "seen_at" TIMESTAMP(3),
    "notified_at" TIMESTAMP(3),

    CONSTRAINT "laniakea_players_pkey" PRIMARY KEY ("user_id")
);

ALTER TABLE "laniakea_players" ADD CONSTRAINT "laniakea_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
