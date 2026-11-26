-- Our test accounts, 20 in all: the 15 made by hand on 2026-10-06 and
-- 2026-10-16 (@fake.com, one @proton.fake.com) and the 5 students of the load
-- test on 2026-10-30 (@bots.cyberstars.app). They were counted with the
-- students in the new accounts chart, the progress and the leaderboard.
-- Deleting an account takes its progress, saved code, conversations and the
-- rest with it; forum posts and notifications it sent stay, without an author.
--
-- tutor_prompts keeps no account, but it was filled from the student messages
-- saved then (20261115120000_add_tutor_prompts), theirs too. Those rows go
-- first, found by the message's time, which the fill copied as it was.

CREATE TEMP TABLE test_accounts AS
SELECT id
FROM users
WHERE role = 'USER'
  AND (email LIKE '%@fake.com' OR email LIKE '%.fake.com' OR email LIKE '%@bots.cyberstars.app');

DELETE FROM tutor_prompts p
USING tutor_messages m
JOIN tutor_conversations c ON c.id = m.conversation_id
WHERE c.user_id IN (SELECT id FROM test_accounts)
  AND m.role = 'student'
  AND p.created_at = m.created_at;

DELETE FROM users WHERE id IN (SELECT id FROM test_accounts);

DROP TABLE test_accounts;
