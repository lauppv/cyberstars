import pool from "../db/db.js";
import type { CurriculumRow, LessonRow } from "../types/lesson.js";

export async function getAllCourses(): Promise<CurriculumRow[]> {
  const result = await pool.query<CurriculumRow>(
    "SELECT * FROM curriculum ORDER BY sort_order"
  );
  return result.rows;
}

export async function getLessonsByCourse(courseKey: string): Promise<LessonRow[]> {
  const result = await pool.query<LessonRow>(
    "SELECT * FROM lessons WHERE course_key = $1 ORDER BY sort_order",
    [courseKey]
  );
  return result.rows;
}

export async function getAllLessons(): Promise<LessonRow[]> {
  const result = await pool.query<LessonRow>(
    "SELECT * FROM lessons ORDER BY course_key, sort_order"
  );
  return result.rows;
}

export async function getLessonCount(courseKey: string): Promise<number> {
  const result = await pool.query<{ count: string }>(
    "SELECT COUNT(*) as count FROM lessons WHERE course_key = $1",
    [courseKey]
  );
  return parseInt(result.rows[0].count, 10);
}
