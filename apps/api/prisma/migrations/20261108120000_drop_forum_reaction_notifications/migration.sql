-- Forum reactions no longer notify their author. Remove the existing rows,
-- then rebuild the enum without the value (Postgres cannot drop a single enum
-- value in place).

DELETE FROM "notifications" WHERE "type" = 'FORUM_REACTION';

ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";

CREATE TYPE "NotificationType" AS ENUM ('FORUM_REPLY', 'FORUM_SOLUTION', 'SUPPORT_TICKET_NEW', 'SUPPORT_REPLY', 'SUPPORT_STATUS', 'CONNECTION_REQUEST', 'CONNECTION_ACCEPTED', 'LANIAKEA_RECAP', 'ANNOUNCEMENT', 'POLL', 'POLL_ANSWER');

ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType" USING ("type"::text::"NotificationType");

DROP TYPE "NotificationType_old";
