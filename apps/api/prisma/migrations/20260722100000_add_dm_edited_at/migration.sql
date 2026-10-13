-- Track when a direct message was last edited so the UI can show an "edited"
-- marker with the edit time. NULL means never edited.
ALTER TABLE "direct_messages" ADD COLUMN "edited_at" TIMESTAMP(3);
