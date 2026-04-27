import pool from "../db/db.js";
import type { UserLessonProgress, UserSavedCode } from "../types/progress.js";

export async function getByUser(userId: number): Promise<UserLessonProgress[]> {
  const result = await pool.query<UserLessonProgress>(
    "SELECT * FROM user_lesson_progress WHERE user_id = $1",
    [userId]
  );
  return result.rows;
}

export async function getByCourse(userId: number, courseKey: string): Promise<UserLessonProgress[]> {
  const result = await pool.query<UserLessonProgress>(
    "SELECT * FROM user_lesson_progress WHERE user_id = $1 AND course_key = $2",
    [userId, courseKey]
  );
  return result.rows;
}

export async function upsertProgress(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  completed: boolean
): Promise<void> {
  await pool.query(
    `INSERT INTO user_lesson_progress (user_id, course_key, lesson_slug, completed, completed_at, last_accessed_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (user_id, course_key, lesson_slug)
     DO UPDATE SET completed = $4, completed_at = $5, last_accessed_at = NOW()`,
    [userId, courseKey, lessonSlug, completed, completed ? new Date() : null]
  );
}

export async function touchAccess(
  userId: number,
  courseKey: string,
  lessonSlug: string
): Promise<void> {
  await pool.query(
    `INSERT INTO user_lesson_progress (user_id, course_key, lesson_slug, last_accessed_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (user_id, course_key, lesson_slug)
     DO UPDATE SET last_accessed_at = NOW()`,
    [userId, courseKey, lessonSlug]
  );
}

export async function getSavedCode(
  userId: number,
  courseKey: string,
  lessonSlug: string
): Promise<string | null> {
  const result = await pool.query<UserSavedCode>(
    "SELECT code FROM user_saved_code WHERE user_id = $1 AND course_key = $2 AND lesson_slug = $3",
    [userId, courseKey, lessonSlug]
  );
  return result.rows[0]?.code ?? null;
}

export async function upsertCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  code: string
): Promise<void> {
  await pool.query(
    `INSERT INTO user_saved_code (user_id, course_key, lesson_slug, code, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (user_id, course_key, lesson_slug)
     DO UPDATE SET code = $4, updated_at = NOW()`,
    [userId, courseKey, lessonSlug, code]
  );
}
