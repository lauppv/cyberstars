import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import type { VisitCount, VisitStep } from '@cyberstars/shared/visits';

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

const isoDay = (day: Date) => day.toISOString().slice(0, 10);

// A guest's visit for the day, made on their first page. A later page that
// brings a source fills it in when the first had none. One INSERT ... ON
// CONFLICT, so two first pages at once still make one visit.
export async function guestVisitFor(
  day: Date,
  visitor: string,
  source: string | null,
  lang: string,
): Promise<number> {
  const [row] = await prisma.$queryRaw<{ id: number }[]>`
    INSERT INTO guest_visits (day, visitor, source, lang)
    VALUES (${isoDay(day)}::date, ${visitor}, ${source}, ${lang})
    ON CONFLICT (day, visitor) DO UPDATE SET source = COALESCE(guest_visits.source, EXCLUDED.source)
    RETURNING id
  `;
  return row.id;
}

// The guest visit this visitor already has today, if any.
export async function guestVisitId(day: Date, visitor: string): Promise<number | null> {
  const row = await prisma.guestVisit.findFirst({ where: { day, visitor }, select: { id: true } });
  return row?.id ?? null;
}

export function countSteps(visitId: number): Promise<number> {
  return prisma.visitStep.count({ where: { visitId } });
}

export function addSteps(visitId: number, steps: VisitStep[]) {
  return prisma.visitStep.createMany({
    data: steps.map((step) => ({ visitId, kind: step.kind, target: step.target })),
  });
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
// all or nothing, so a crash halfway never loses a day or counts it twice. Its
// guest visits stay, without their hash, until they're older than `keepFrom`.
export async function rollUpBefore(today: Date, keepFrom: Date): Promise<void> {
  const before = Prisma.sql`day < ${today}`;
  await prisma.$transaction([
    prisma.$executeRaw`
      INSERT INTO visit_totals (day, dimension, key, visitors, views)
      ${totalsFrom(before)}
      ON CONFLICT DO NOTHING
    `,
    prisma.pageVisit.deleteMany({ where: { day: { lt: today } } }),
    prisma.visitSalt.deleteMany({ where: { day: { lt: today } } }),
    prisma.guestVisit.updateMany({
      where: { day: { lt: today }, visitor: { not: null } },
      data: { visitor: null },
    }),
    prisma.guestVisit.deleteMany({ where: { day: { lt: keepFrom } } }),
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

// The buttons guests pressed since `from`: in how many visits, and how often.
export function topClicksSince(from: Date, limit: number): Promise<VisitCount[]> {
  return prisma.$queryRaw<VisitCount[]>(Prisma.sql`
    SELECT s.target AS key, COUNT(DISTINCT s.visit_id)::int AS visitors, COUNT(*)::int AS views
    FROM visit_steps s JOIN guest_visits v ON v.id = s.visit_id
    WHERE v.day >= ${from} AND s.kind = 'click'
    GROUP BY s.target
    ORDER BY views DESC, key
    LIMIT ${limit}
  `);
}

// The placement test's steps since `from`, each by how many visits took it.
// Its page counts once per visit as `opened`, in English or Romanian.
export function placementStepsSince(from: Date): Promise<{ key: string; visitors: number }[]> {
  return prisma.$queryRaw<{ key: string; visitors: number }[]>(Prisma.sql`
    SELECT CASE WHEN s.kind = 'page' THEN 'opened' ELSE s.target END AS key,
      COUNT(DISTINCT s.visit_id)::int AS visitors
    FROM visit_steps s JOIN guest_visits v ON v.id = s.visit_id
    WHERE v.day >= ${from}
      AND ((s.kind = 'page' AND s.target IN ('/placement', '/ro/placement'))
        OR (s.kind = 'click' AND s.target LIKE 'placement-%'))
    GROUP BY 1
  `);
}

// Guest visits since `from`, newest first, each with its steps in order.
// before is the id the page starts under; source keeps only visits from there.
export function guestVisitsSince(
  from: Date,
  { source, before, take }: { source?: string; before?: number; take: number },
) {
  return prisma.guestVisit.findMany({
    where: {
      day: { gte: from },
      ...(source !== undefined && { source }),
      ...(before !== undefined && { id: { lt: before } }),
    },
    orderBy: { id: 'desc' },
    take,
    select: {
      id: true,
      day: true,
      startedAt: true,
      source: true,
      lang: true,
      steps: { select: { kind: true, target: true }, orderBy: { id: 'asc' } },
    },
  });
}
