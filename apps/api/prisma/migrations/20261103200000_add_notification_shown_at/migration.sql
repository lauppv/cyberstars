-- When the dashboard's window showed an announcement or a poll, so it shows each once
ALTER TABLE "notifications" ADD COLUMN "shown_at" TIMESTAMP(3);
