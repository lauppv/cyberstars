import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';

export interface PageVisitRow {
  day: Date;
  visitor: string;
  path: string;
  source: string | null;
  signedIn: boolean;
  lang: string;
}

export interface TotalRow {
  day: Date;
  dimension: string;
  key: string;
  visitors: number;
  views: number;
}

export function addVisit(row: PageVisitRow) {
  return prisma.pageVisit.create({ data: row });
}

// The day's salt, made on the first visit of the day. The empty update makes
// the upsert a single INSERT ... ON CONFLICT, so two first visits at once still
// end up with the same salt.
export async function saltFor(day: Date, fresh: string): Promise<string> {
  const row = await prisma.visitSalt.upsert({
    where: { day },
    create: { day, salt: fresh },
    update: {},
  });
  return row.salt;
}

// Every count kept for a day, straight from its visits. A visitor is counted
// once per page, source, guest or signed in and language, so a student who
// signs in halfway shows up as both. Built when called, like the leaderboard's
// query, so tests that mock @prisma/client can still import this module.
function totalsFrom(where: Prisma.Sql) {
  const counts = Prisma.sql`COUNT(DISTINCT visitor)::int AS visitors, COUNT(*)::int AS views`;
  return Prisma.sql`
    SELECT day, 'all' AS dimension, '' AS key, ${counts} FROM page_visits WHERE ${where} GROUP BY day
    UNION ALL
    SELECT day, 'page', path, ${counts} FROM page_visits WHERE ${where} GROUP BY day, path
    UNION ALL
    SELECT day, 'source', source, ${counts} FROM page_visits
      WHERE ${where} AND source IS NOT NULL GROUP BY day, source
    UNION ALL
    SELECT day, 'auth', CASE WHEN signed_in THEN 'signedIn' ELSE 'guest' END, ${counts}
      FROM page_visits WHERE ${where} GROUP BY 1, 3
    UNION ALL
    SELECT day, 'lang', lang, ${counts} FROM page_visits WHERE ${where} GROUP BY day, lang
  `;
}

// Turns every day before `today` into totals and deletes its visits and salt,
// all or nothing, so a crash halfway never loses a day or counts it twice.
export async function rollUpBefore(today: Date): Promise<void> {
  const before = Prisma.sql`day < ${today}`;
  await prisma.$transaction([
    prisma.$executeRaw`
      INSERT INTO visit_totals (day, dimension, key, visitors, views)
      ${totalsFrom(before)}
      ON CONFLICT DO NOTHING
    `,
    prisma.pageVisit.deleteMany({ where: { day: { lt: today } } }),
    prisma.visitSalt.deleteMany({ where: { day: { lt: today } } }),
  ]);
}

// Totals since `from`: the finished days already rolled up, plus today (and
// yesterday, in the hour after midnight before the roll-up runs) counted live.
export function totalsSince(from: Date): Promise<TotalRow[]> {
  return prisma.$queryRaw<TotalRow[]>(Prisma.sql`
    SELECT day, dimension, key, visitors, views FROM visit_totals WHERE day >= ${from}
    UNION ALL
    ${totalsFrom(Prisma.sql`day >= ${from}`)}
  `);
}

// Accounts made each day since `from`, by Romania's calendar. created_at is
// stored as UTC without a zone, hence the double AT TIME ZONE.
export function newAccountsSince(from: Date): Promise<{ day: Date; count: number }[]> {
  return prisma.$queryRaw<{ day: Date; count: number }[]>(Prisma.sql`
    SELECT (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Bucharest')::date AS day,
      COUNT(*)::int AS count
    FROM users
    WHERE (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Bucharest')::date >= ${from}
    GROUP BY 1
  `);
}
