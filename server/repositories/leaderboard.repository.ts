import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';

export interface LeaderboardRow {
  id: number;
  name: string;
  avatar_url: string | null;
  total_xp: number;
  lessons_done: number;
  rank: number;
}

// Every user ranked by total XP, highest first. RANK() leaves gaps on ties
// (§7.4). Secondary order by id keeps pagination stable within a tie. The full
// list is cached in the service, so this runs at most once per cache window.
//
// XP is DERIVED, never stored (see shared/constants.ts). We recompute the exact
// same amount as progress.service.getCourseProgress, but in one aggregate query
// instead of N Node calculations: the per-lesson award is xpForLesson(sortOrder)
// = 10 + (sortOrder - 1), plus the daily-pick bonus round(award * 0.2) for
// lessons the user was awarded a daily bonus on (DailyPick.bonusAwarded). The
// join is on (course_key, lesson_slug) — UserLessonProgress has no lessonId —
// and only completed rows that map to a real lesson count.
//
// Note: the query is built inside the function (not a module-level constant) so
// Prisma.sql only evaluates when called — route tests that mock @prisma/client
// without the Prisma export can import this module without tripping it.
export async function getRanked(): Promise<LeaderboardRow[]> {
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
      COUNT(l.id)::int AS lessons_done
    FROM users u
    LEFT JOIN user_lesson_progress p ON p.user_id = u.id AND p.completed = true
    LEFT JOIN lessons l ON l.course_key = p.course_key AND l.slug = p.lesson_slug
    GROUP BY u.id, u.name, u.avatar_url
  `;
  return prisma.$queryRaw<LeaderboardRow[]>(Prisma.sql`
    SELECT id, name, avatar_url, total_xp, lessons_done,
      CAST(RANK() OVER (ORDER BY total_xp DESC) AS int) AS rank
    FROM (${ranked}) ranked
    ORDER BY rank, id
  `);
}
