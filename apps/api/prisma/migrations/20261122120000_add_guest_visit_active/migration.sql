-- Whether the guest did anything on the site that day: pressed, typed, scrolled
-- by hand or touched the screen. A visitor who only loads pages, as a scraper
-- does, is counted apart on the admin page, not with the people.
ALTER TABLE "guest_visits" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT false;

-- Visits from before the app told: active when they pressed a button, scrolled
-- or opened more than one page.
UPDATE "guest_visits" g SET "active" = true
WHERE EXISTS (
    SELECT 1 FROM "visit_steps" s WHERE s."visit_id" = g."id" AND s."kind" IN ('click', 'scroll')
  )
  OR (SELECT COUNT(*) FROM "visit_steps" s WHERE s."visit_id" = g."id" AND s."kind" = 'page') > 1;
