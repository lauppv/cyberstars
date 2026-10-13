-- DM sends no longer create bell notifications (the messages badge already
-- covers them). Remove the existing rows, then rebuild the enum without the
-- value (Postgres cannot drop a single enum value in place).

DELETE FROM "notifications" WHERE "type" = 'DM_MESSAGE';

ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";

CREATE TYPE "NotificationType" AS ENUM ('FORUM_REPLY', 'FORUM_SOLUTION', 'FORUM_REACTION', 'SUPPORT_TICKET_NEW', 'SUPPORT_REPLY', 'SUPPORT_STATUS', 'CONNECTION_REQUEST', 'CONNECTION_ACCEPTED');

ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType" USING ("type"::text::"NotificationType");

DROP TYPE "NotificationType_old";
