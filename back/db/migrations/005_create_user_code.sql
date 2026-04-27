CREATE TABLE IF NOT EXISTS user_saved_code (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_key VARCHAR(50) NOT NULL,
    lesson_slug VARCHAR(100) NOT NULL,
    code TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_key, lesson_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_code_user ON user_saved_code(user_id);
