-- The admin page counts students only: USER accounts that aren't our test
-- accounts (BOT_EMAIL_ENDINGS in user.repository.ts). Polls and announcements
-- sent before this counted every account but the author's: recount them.
--
-- Recipients become the students who had an account when it was sent, the
-- same rule the app uses to decide who may open a poll. Students who deleted
-- their account since drop out, and so do the 20 test accounts deleted on
-- 2026-11-22. Viewers, voters and openers become the students among those
-- noted, so they never outgrow the recipients. The votes per option stay as
-- they are: a vote isn't tied to who cast it.

CREATE TEMP TABLE students AS
SELECT id, created_at FROM users
WHERE role = 'USER'
  AND email NOT LIKE '%@fake.com'
  AND email NOT LIKE '%.fake.com'
  AND email NOT LIKE '%@bots.cyberstars.app';

UPDATE polls p SET
  recipients = (
    SELECT COUNT(*) FROM students s
    WHERE s.created_at <= p.created_at AND s.id IS DISTINCT FROM p.author_id
  ),
  voters = (SELECT COUNT(*) FROM poll_voters v JOIN students s ON s.id = v.user_id WHERE v.poll_id = p.id),
  viewers = CASE WHEN p.counts_viewers
    THEN (SELECT COUNT(*) FROM poll_viewers v JOIN students s ON s.id = v.user_id WHERE v.poll_id = p.id)
    ELSE p.viewers END;

UPDATE announcements a SET
  recipients = (
    SELECT COUNT(*) FROM students s
    WHERE s.created_at <= a.created_at AND s.id IS DISTINCT FROM a.author_id
  ),
  openers = CASE WHEN a.counts_opens
    THEN (SELECT COUNT(*) FROM announcement_openers o JOIN students s ON s.id = o.user_id WHERE o.announcement_id = a.id)
    ELSE a.openers END;

DROP TABLE students;
