-- Names now take English letters only: the one account signed up in Chinese gets its name translated
UPDATE "users" SET "name" = 'Little Hui who never wakes up' WHERE "name" = '睡不醒的小辉';
