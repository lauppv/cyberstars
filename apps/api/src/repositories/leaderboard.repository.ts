import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import {
  DAILY_BONUS_RATIO,
  WEB_COURSE_KEYS,
  isClosedCourse,
  xpForLesson,
} from '@cyberstars/shared/constants';
import { PROJECTS, PROJECT_XP } from '@cyberstars/shared/projects';
import { BOT_EMAIL_ENDINGS } from './user.repository.js';

export interface LeaderboardRow {
  id: number;
  name: string;
  avatar_url: string | null;
  total_xp: number;
  lessons_done: number;
  rank: number;
}

// Every lesson's XP as VALUES rows (course_key, slug, xp), counted with the
// course's lesson count as progress.service does. A row that matches nothing
// stands in when there are no lessons, since VALUES can't be empty.
async function lessonXpTable(): Promise<Prisma.Sql> {
  const lessons = await prisma.lesson.findMany({
    select: { courseKey: true, slug: true, sortOrder: true, title: true },
  });
  const counts = new Map<string, number>();
  for (const l of lessons) counts.set(l.courseKey, (counts.get(l.courseKey) ?? 0) + 1);
  const rows = lessons.map(
    (l) =>
      Prisma.sql`(${l.courseKey}::text, ${l.slug}::text, ${xpForLesson(l.courseKey, l, counts.get(l.courseKey)!)}::int)`,
  );
  return Prisma.join(rows.length ? rows : [Prisma.sql`(NULL::text, NULL::text, 0::int)`]);
}

// Every user ranked by total XP, highest first, each on a place of their own.
// A tie goes to whoever got there first, the one whose latest counted lesson
// was completed earlier; id settles the rest (no XP, or no completion time)
// and keeps pagination stable. The full list is cached in the service, so this
// runs at most once per cache window.
//
// XP is DERIVED, never stored (see shared/constants.ts). We recompute the exact
// same amount as progress.service.getCourseProgress, but in one aggregate query
// instead of N Node calculations: each lesson's award comes from the shared
// xpForLesson, read as a VALUES table (course_key, slug, xp), so the formula
// lives in one place; plus the daily-pick bonus round(award * DAILY_BONUS_RATIO)
// for lessons the user was awarded a daily bonus on (DailyPick.bonusAwarded).
// The join is on (course_key, lesson_slug), since UserLessonProgress has no
// lessonId, and only completed rows that map to a real lesson count. A closed
// course (isClosedCourse) earns no XP here, as in the client's useGamification.
//
// Note: the query is built inside the function (not a module-level constant) so
// Prisma.sql only evaluates when called, so route tests that mock @prisma/client
// without the Prisma export can import this module without tripping it.
//
// Finished projects add their PROJECT_XP, read from the catalog as a VALUES
// table, since the catalog lives in code; a project taken out of it gives none.
//
// Our test accounts (BOT_EMAIL_ENDINGS) never show on the board.
export async function getRanked(): Promise<LeaderboardRow[]> {
  const closed = WEB_COURSE_KEYS.filter(isClosedCourse);
  const bots = BOT_EMAIL_ENDINGS.map((ending) => `%${ending}`);
  const catalog = Prisma.join(
    PROJECTS.map(
      (p) => Prisma.sql`(${p.language}::text, ${p.slug}::text, ${PROJECT_XP[p.difficulty]}::int)`,
    ),
  );
  const lessonXp = await lessonXpTable();
  const projects = Prisma.sql`
    SELECT pc.user_id, SUM(px.xp)::int AS xp, MAX(pc.completed_at) AS reached_at
    FROM project_completions pc
    JOIN (VALUES ${catalog}) AS px(language, slug, xp)
      ON px.language = pc.language AND px.slug = pc.project_slug
    GROUP BY pc.user_id
  `;
  const ranked = Prisma.sql`
    SELECT
      u.id,
      u.name,
      u.avatar_url,
      COALESCE(SUM(
        l.xp
        + CASE WHEN EXISTS (
            SELECT 1 FROM daily_picks dp
            WHERE dp.user_id = p.user_id
              AND dp.course_key = p.course_key
              AND dp.lesson_slug = p.lesson_slug
              AND dp.bonus_awarded = true
          ) THEN round(l.xp * ${DAILY_BONUS_RATIO}::numeric) ELSE 0 END
      ), 0)::int AS total_xp,
      COUNT(l.slug)::int AS lessons_done,
      MAX(CASE WHEN l.slug IS NOT NULL THEN p.completed_at END) AS reached_at
    FROM users u
    LEFT JOIN user_lesson_progress p ON p.user_id = u.id AND p.completed = true
      AND p.course_key <> ALL(${closed}::text[])
    LEFT JOIN (VALUES ${lessonXp}) AS l(course_key, slug, xp)
      ON l.course_key = p.course_key AND l.slug = p.lesson_slug
    WHERE NOT (u.email LIKE ANY(${bots}::text[]))
    GROUP BY u.id, u.name, u.avatar_url
  `;
  return prisma.$queryRaw<LeaderboardRow[]>(Prisma.sql`
    SELECT id, name, avatar_url, total_xp, lessons_done,
      CAST(ROW_NUMBER() OVER (ORDER BY total_xp DESC, reached_at ASC NULLS LAST, id) AS int) AS rank
    FROM (
      SELECT ranked.id, ranked.name, ranked.avatar_url, ranked.lessons_done,
        (ranked.total_xp + COALESCE(projects.xp, 0))::int AS total_xp,
        GREATEST(ranked.reached_at, projects.reached_at) AS reached_at
      FROM (${ranked}) ranked
      LEFT JOIN (${projects}) projects ON projects.user_id = ranked.id
    ) totals
    ORDER BY rank
  `);
}
