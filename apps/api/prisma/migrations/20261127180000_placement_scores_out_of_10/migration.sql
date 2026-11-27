-- The placement test now asks 10 questions from the courses the student
-- picked, not 12 from Python, C, Java and Linux, and its levels end at 3 and 6
-- in place of 4 and 8. A score out of 12 times 10 / 12, rounded down, keeps
-- every saved score on its level: 0-4 become 0-3, 5-8 become 4-6, 9-12
-- become 7-10.
UPDATE users
SET placement_score = placement_score * 10 / 12
WHERE placement_score IS NOT NULL;
