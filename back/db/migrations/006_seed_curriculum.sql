INSERT INTO curriculum (key, title, description, sort_order) VALUES
  ('python', 'Python', 'New to programming? We highly recommend Python', 1),
  ('c', 'C', 'Understanding low-level programming', 2),
  ('java', 'Java', 'Object Oriented Programming', 3)
ON CONFLICT (key) DO NOTHING;

INSERT INTO lessons (course_key, slug, title, sort_order, has_code_file) VALUES
  ('python', 'print', 'Print', 1, true),
  ('python', 'variables-str', 'Variables (Strings)', 2, true),
  ('python', 'variables-int', 'Variables (Integers)', 3, true),
  ('python', 'print-f', 'Print F-strings', 4, true),
  ('python', 'comment', 'Comments', 5, true),
  ('python', 'if-else', 'If/Else', 6, true),
  ('python', 'if-elif-else', 'If/Elif/Else', 7, true),
  ('python', 'for', 'For Loops', 8, true),
  ('python', 'while', 'While Loops', 9, true),
  ('python', 'functions', 'Functions', 10, true),
  ('c', 'variables', 'Variables', 1, true),
  ('c', 'print', 'Print', 2, false),
  ('java', 'variables', 'Variables', 1, false),
  ('java', 'print', 'Print', 2, false)
ON CONFLICT (course_key, slug) DO NOTHING;
