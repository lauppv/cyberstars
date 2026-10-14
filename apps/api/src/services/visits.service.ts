import crypto from 'crypto';
import * as visitsRepo from '../repositories/visits.repository.js';
import type {
  AdminVisitsDTO,
  PageViewReport,
  VisitCount,
  VisitDay,
  VisitRange,
} from '@cyberstars/shared/visits';

// Visitors are counted the way Plausible does it, without a cookie: a hash of
// the IP and the browser with a salt that's new every day. The salt sits in the
// database only for its day (in memory it wouldn't survive a deploy, and the
// same person would count twice that day), and goes with the day's visits once
// they become totals. No IP is ever stored.

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

// Where a visit started: null for a page opened inside the app, "direct" when
// the browser sent no referrer.
export function sourceOf(referrer: string | undefined): string | null {
  if (referrer === undefined) return null;
  const host = referrer.toLowerCase().replace(/^www\./, '');
  if (!host) return 'direct';
  if (!DOMAIN.test(host)) return 'other';
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

export async function recordPageView(
  report: PageViewReport,
  ip: string,
  userAgent: string | undefined,
  signedIn: boolean,
): Promise<void> {
  if (isBot(userAgent)) return;
  const day = today();
  const visitor = crypto
    .createHash('sha256')
    .update(`${await saltFor(day)}|${ip}|${userAgent}`)
    .digest('hex');
  const ro = report.path === '/ro' || report.path.startsWith('/ro/');
  await visitsRepo.addVisit({
    day: asDate(day),
    visitor,
    // A page and its Romanian twin count as one page; lang tells them apart.
    path: ro ? report.path.slice(3) || '/' : report.path,
    source: sourceOf(report.referrer),
    signedIn,
    lang: ro ? 'ro' : 'en',
  });
}

// Rolls every finished day into totals. Safe to run any time: it only touches
// days before today, all at once.
export function rollUp(): Promise<void> {
  return visitsRepo.rollUpBefore(asDate(today()));
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

// Over several days a visitor counts once per day they came, the only way to
// add days up once each day's hashes are gone.
export async function report(range: VisitRange): Promise<AdminVisitsDTO> {
  const last = today();
  const first = dayBefore(last, range - 1);
  const [rows, accounts] = await Promise.all([
    visitsRepo.totalsSince(asDate(first)),
    visitsRepo.newAccountsSince(asDate(first)),
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
  };
}
