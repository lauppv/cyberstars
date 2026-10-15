-- When a guest's visit started: the time of its first page. Added without a
-- default first, so the visits already there stay empty rather than get the
-- time of this migration.
ALTER TABLE "guest_visits" ADD COLUMN "started_at" TIMESTAMP(3);

ALTER TABLE "guest_visits" ALTER COLUMN "started_at" SET DEFAULT CURRENT_TIMESTAMP;
