import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import { WEB_COURSE_KEYS, isClosedCourse } from '@cyberstars/shared/constants';

export interface LeaderboardRow {
  id: number;
  name: string;
  avatar_url: string | null;
  total_xp: number;
  lessons_done: number;
  rank: number;
}

// Every user ranked by total XP, highest first, each on a place of their own.
// A tie goes to whoever got there first, the one whose latest counted lesson
// was completed earlier; id settles the rest (no XP, or no completion time)
// and keeps pagination stable. The full list is cached in the service, so this
// runs at most once per cache window.
//
// XP is DERIVED, never stored (see shared/constants.ts). We recompute the exact
// same amount as progress.service.getCourseProgress, but in one aggregate query
// instead of N Node calculations: the per-lesson award is xpForLesson(sortOrder)
// = 10 + (sortOrder - 1), plus the daily-pick bonus round(award * 0.2) for
// lessons the user was awarded a daily bonus on (DailyPick.bonusAwarded). The
// join is on (course_key, lesson_slug), since UserLessonProgress has no lessonId,
// and only completed rows that map to a real lesson count. A closed course
// (isClosedCourse) earns no XP here, as in the client's useGamification.
//
// Note: the query is built inside the function (not a module-level constant) so
// Prisma.sql only evaluates when called, so route tests that mock @prisma/client
// without the Prisma export can import this module without tripping it.
export async function getRanked(): Promise<LeaderboardRow[]> {
  const closed = WEB_COURSE_KEYS.filter(isClosedCourse);
  const ranked = Prisma.sql`
    SELECT
      u.id,
      u.name,
      u.avatar_url,
      COALESCE(SUM(
        (10 + (l.sort_order - 1))
        + CASE WHEN EXISTS (
            SELECT 1 FROM daily_picks dp
            WHERE dp.user_id = p.user_id
              AND dp.course_key = p.course_key
              AND dp.lesson_slug = p.lesson_slug
              AND dp.bonus_awarded = true
          ) THEN round((10 + (l.sort_order - 1)) * 0.2) ELSE 0 END
      ), 0)::int AS total_xp,
      COUNT(l.id)::int AS lessons_done,
      MAX(CASE WHEN l.id IS NOT NULL THEN p.completed_at END) AS reached_at
    FROM users u
    LEFT JOIN user_lesson_progress p ON p.user_id = u.id AND p.completed = true
      AND p.course_key <> ALL(${closed}::text[])
    LEFT JOIN lessons l ON l.course_key = p.course_key AND l.slug = p.lesson_slug
    GROUP BY u.id, u.name, u.avatar_url
  `;
  return prisma.$queryRaw<LeaderboardRow[]>(Prisma.sql`
    SELECT id, name, avatar_url, total_xp, lessons_done,
      CAST(ROW_NUMBER() OVER (ORDER BY total_xp DESC, reached_at ASC NULLS LAST, id) AS int) AS rank
    FROM (${ranked}) ranked
    ORDER BY rank
  `);
}
