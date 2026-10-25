import crypto from 'crypto';
import * as visitsRepo from '../repositories/visits.repository.js';
import { VISIT_RANGES } from '@cyberstars/shared/visits';
import { PLACEMENT_QUESTION_COUNT } from '@cyberstars/shared/placement';
import type {
  AdminVisitsDTO,
  GuestVisitsDTO,
  PageViewReport,
  PlacementFunnel,
  StepsReport,
  VisitCount,
  VisitDay,
  VisitRange,
  VisitStep,
} from '@cyberstars/shared/visits';

// Visitors are counted the way Plausible does it, without a cookie: a hash of
// the IP and the browser with a salt that's new every day. The salt sits in the
// database only for its day (in memory it wouldn't survive a deploy, and the
// same person would count twice that day), and goes with the day's visits once
// they become totals. No IP is ever stored.
//
// A guest's day is also kept as a visit: its pages, the buttons pressed and how
// far down each page they scrolled, in order (CYB-66). Once the day ends the
// visit loses its hash, so it can't be tied to anyone, and it's deleted after
// the longest range the admin page shows.

const DAY_FORMAT = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' });
const DAY_MS = 24 * 60 * 60 * 1000;

// Today in Romania, as YYYY-MM-DD (en-CA writes dates that way).
export function today(now = new Date()): string {
  return DAY_FORMAT.format(now);
}

function asDate(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

function dayBefore(day: string, n: number): string {
  return new Date(asDate(day).getTime() - n * DAY_MS).toISOString().slice(0, 10);
}

// Anything that says it's a bot, a crawler or a script. Googlebot runs the app's
// scripts too, so it would count without this.
const BOT_UA =
  /bot|crawl|spider|slurp|archiver|facebookexternalhit|headless|lighthouse|preview|curl|wget|python-|java\/|go-http|node-fetch|axios|okhttp/i;

export function isBot(userAgent: string | undefined): boolean {
  return !userAgent || BOT_UA.test(userAgent);
}

// The places CYB-64 posts to get a name of their own; any other site shows up
// by its domain.
const KNOWN_SOURCES: [RegExp, string][] = [
  [/(^|\.)google\.[a-z.]+$/, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)reddit\.com$/, 'reddit'],
  [/^news\.ycombinator\.com$/, 'hackernews'],
  [/^dev\.to$/, 'devto'],
  [/(^|\.)github\.com$/, 'github'],
];

const DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
const SOURCE_MAX = 100; // page_visits.source is VARCHAR(100)

// Where a visit started: null for a page opened inside the app, "direct" when
// the browser sent no referrer.
export function sourceOf(referrer: string | undefined): string | null {
  if (referrer === undefined) return null;
  const host = referrer.toLowerCase().replace(/^www\./, '');
  if (!host) return 'direct';
  // A longer domain wouldn't fit the column, and the whole visit would be lost.
  if (host.length > SOURCE_MAX || !DOMAIN.test(host)) return 'other';
  return KNOWN_SOURCES.find(([pattern]) => pattern.test(host))?.[1] ?? host;
}

let salt: { day: string; value: Promise<string> } | null = null;

function saltFor(day: string): Promise<string> {
  if (salt?.day !== day) {
    const value = visitsRepo.saltFor(asDate(day), crypto.randomBytes(32).toString('hex'));
    // A failed read mustn't stick for the rest of the day.
    value.catch(() => {
      if (salt?.value === value) salt = null;
    });
    salt = { day, value };
  }
  return salt.value;
}

async function visitorFor(day: string, ip: string, userAgent: string | undefined) {
  return crypto
    .createHash('sha256')
    .update(`${await saltFor(day)}|${ip}|${userAgent}`)
    .digest('hex');
}

// A visit holds this many steps at most, so a script posting steps in a loop
// can't fill the table for two years. A real guest stays far below it.
const MAX_STEPS = 500;

async function addSteps(visitId: number | null, steps: VisitStep[]): Promise<void> {
  if (visitId === null || steps.length === 0) return;
  const room = MAX_STEPS - (await visitsRepo.countSteps(visitId));
  if (room > 0) await visitsRepo.addSteps(visitId, steps.slice(0, room));
}

export async function recordPageView(
  report: PageViewReport,
  ip: string,
  userAgent: string | undefined,
  signedIn: boolean,
): Promise<void> {
  if (isBot(userAgent)) return;
  const day = today();
  const visitor = await visitorFor(day, ip, userAgent);
  const ro = report.path === '/ro' || report.path.startsWith('/ro/');
  // A page and its Romanian twin count as one page; lang tells them apart.
  const path = ro ? report.path.slice(3) || '/' : report.path;
  const lang = ro ? 'ro' : 'en';
  const source = sourceOf(report.referrer);
  await visitsRepo.addVisit({ day: asDate(day), visitor, path, source, signedIn, lang });

  const steps = report.steps ?? [];
  if (signedIn) {
    // Only a guest who just made an account sends any: what they pressed on the
    // way still belongs to their visit, and the pages after it don't.
    if (steps.length > 0) {
      await addSteps(await visitsRepo.guestVisitId(asDate(day), visitor), steps);
    }
    return;
  }
  const visitId = await visitsRepo.guestVisitFor(asDate(day), visitor, source, lang);
  await addSteps(visitId, [...steps, { kind: 'page', target: path }]);
}

// Clicks and scrolls on the page a guest is still on. They join the visit their
// first page made; with none today there's nothing to add them to.
export async function recordSteps(
  report: StepsReport,
  ip: string,
  userAgent: string | undefined,
): Promise<void> {
  if (isBot(userAgent)) return;
  const day = today();
  const visitor = await visitorFor(day, ip, userAgent);
  await addSteps(await visitsRepo.guestVisitId(asDate(day), visitor), report.steps);
}

// Guest visits are kept as long as the longest range the admin page shows.
const KEEP_DAYS = Math.max(...VISIT_RANGES);

// Rolls every finished day into totals. Safe to run any time: it only touches
// days before today, all at once.
export function rollUp(): Promise<void> {
  const day = today();
  return visitsRepo.rollUpBefore(asDate(day), asDate(dayBefore(day, KEEP_DAYS - 1)));
}

const HOUR_MS = 60 * 60 * 1000;

// Once at start (a deploy may have slept through midnight) and then every hour.
export function scheduleRollUp(): NodeJS.Timeout {
  const run = () => rollUp().catch((err) => console.error('[visits] roll-up failed:', err));
  void run();
  return setInterval(run, HOUR_MS).unref();
}

function sumByKey(rows: visitsRepo.TotalRow[], dimension: string): VisitCount[] {
  const sums = new Map<string, VisitCount>();
  for (const row of rows) {
    if (row.dimension !== dimension) continue;
    const sum = sums.get(row.key) ?? { key: row.key, visitors: 0, views: 0 };
    sum.visitors += row.visitors;
    sum.views += row.views;
    sums.set(row.key, sum);
  }
  return [...sums.values()];
}

const TOP_PAGES = 10;
const TOP_SOURCES = 10;
const TOP_CLICKS = 10;

// Over several days a visitor counts once per day they came, the only way to
// add days up once each day's hashes are gone.
export async function report(range: VisitRange): Promise<AdminVisitsDTO> {
  const last = today();
  const first = dayBefore(last, range - 1);
  const [rows, accounts, clicks, placement] = await Promise.all([
    visitsRepo.totalsSince(asDate(first)),
    visitsRepo.newAccountsSince(asDate(first)),
    visitsRepo.topClicksSince(asDate(first), TOP_CLICKS),
    visitsRepo.placementStepsSince(asDate(first)),
  ]);

  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const totals = new Map(
    rows.filter((r) => r.dimension === 'all').map((r) => [dayKey(r.day), r] as const),
  );
  const newAccounts = new Map(accounts.map((a) => [dayKey(a.day), a.count] as const));
  const days: VisitDay[] = [];
  for (let i = range - 1; i >= 0; i--) {
    const day = dayBefore(last, i);
    days.push({
      day,
      visitors: totals.get(day)?.visitors ?? 0,
      views: totals.get(day)?.views ?? 0,
      newAccounts: newAccounts.get(day) ?? 0,
    });
  }

  return {
    range,
    days,
    pages: sumByKey(rows, 'page')
      .sort((a, b) => b.views - a.views)
      .slice(0, TOP_PAGES),
    sources: sumByKey(rows, 'source')
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, TOP_SOURCES),
    auth: sumByKey(rows, 'auth'),
    lang: sumByKey(rows, 'lang'),
    clicks,
    placement: placementFunnel(placement),
  };
}

// The test's Next on question N is pressed as placement-qN and its Submit on
// the last one as placement-submit. There is no going past a question
// unanswered, so a visit that got past one got past every one before it.
function placementFunnel(steps: { key: string; visitors: number }[]): PlacementFunnel {
  const visits = (key: string) => steps.find((s) => s.key === key)?.visitors ?? 0;
  return {
    opened: visits('opened'),
    started: visits('placement-start'),
    answered: Array.from({ length: PLACEMENT_QUESTION_COUNT }, (_, i) =>
      visits(i === PLACEMENT_QUESTION_COUNT - 1 ? 'placement-submit' : `placement-q${i + 1}`),
    ),
    getStarted: visits('placement-get-started'),
  };
}

const VISITS_PAGE = 20;

// The guest visits of the range, newest first, a page at a time.
export async function guestVisits(
  range: VisitRange,
  { source, before }: { source?: string; before?: number } = {},
): Promise<GuestVisitsDTO> {
  const first = dayBefore(today(), range - 1);
  const rows = await visitsRepo.guestVisitsSince(asDate(first), {
    source,
    before,
    take: VISITS_PAGE + 1,
  });
  const page = rows.slice(0, VISITS_PAGE);
  return {
    visits: page.map((row) => ({
      id: row.id,
      day: row.day.toISOString().slice(0, 10),
      startedAt: row.startedAt?.toISOString() ?? null,
      source: row.source,
      lang: row.lang,
      steps: row.steps as VisitStep[],
    })),
    next: rows.length > VISITS_PAGE ? page[page.length - 1].id : null,
  };
}
