-- The Kotlin course is gone, so its lesson, the course itself and everything
-- students left on it go too. A conversation's messages go with it (cascade).

DELETE FROM "user_lesson_progress" WHERE "course_key" = 'kotlin';
DELETE FROM "user_saved_code" WHERE "course_key" = 'kotlin';
DELETE FROM "lesson_submissions" WHERE "course_key" = 'kotlin';
DELETE FROM "daily_picks" WHERE "course_key" = 'kotlin';
DELETE FROM "tutor_conversations" WHERE "course_key" = 'kotlin';
DELETE FROM "lessons" WHERE "course_key" = 'kotlin';
DELETE FROM "curriculum" WHERE "key" = 'kotlin';
