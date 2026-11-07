import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useAuth, wasSignedIn } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { PageContainer, PageLoading } from '../components/layout/PageContainer';
import { ActivityHeatmap } from '../components/gamification/ActivityHeatmap';
import { bucketByLocalDay, type DayCounts } from '../components/gamification/heatmap-utils';
import * as profileService from '../services/profileService';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import type { Course } from '@cyberstars/shared/lesson';
import { courseMeta, courseWash } from '../constants/courses';
import { CourseMark } from '../components/ui/CourseMark';
import { useGamification } from '../hooks/useGamification';
import { ArrowRight, Award, BookCheck, Check, Flame } from 'lucide-react';
import {
  LISTED_COURSE_KEYS,
  isClosedCourse,
  progressPct,
  xpForLesson,
  dailyBonusXp,
} from '@cyberstars/shared/constants';
import { StoryModal } from './StoryModal';
import { LaniakeaCard } from '../components/laniakea/LaniakeaCard';
import { DashboardNotices } from '../components/notifications/DashboardNotices';
import { LandingPage } from './LandingPage';
import { fetchAlmanacSlugs, fetchAlmanacArticle } from '../services/almanacService';
import type { AlmanacArticle } from '@cyberstars/shared/almanac';
import { fetchDaily } from '../services/dailyService';
import type { DailyResponse } from '@cyberstars/shared/daily';

const TODAY_SEED = Math.floor(Date.now() / 86400000);

// The dashboard's heatmap covers the year, which fills its row
const HEATMAP_MONTHS = 12;

// By an article's category, the same in both languages; its tag is translated
const CAT_COLORS: Record<string, string> = {
  oss: '#00D68F',
  legends: '#a855f7',
  hardware: '#FFAA00',
  history: '#3b82f6',
  internet: '#06b6d4',
  security: '#ef4444',
  ai: '#8b5cf6',
  space: '#6366f1',
};

function seededPick<T>(items: T[], count: number, seed: number): T[] {
  const indices = items.map((_, i) => i);
  let s = seed;
  for (let i = indices.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count).map((i) => items[i]);
}

interface ResolvedPick {
  courseKey: string;
  courseTitle: string;
  slug: string;
  title: string;
  completed: boolean;
  xp: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Whether the account was made in the last 24 hours
function isFirstDay(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < DAY_MS;
}

export function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ro' ? 'ro' : 'en';
  const { isLoggedIn, isLoading, user } = useAuth();
  const [almanacStory, setAlmanacStory] = useState<AlmanacArticle | null>(null);
  const [almanacHighlights, setAlmanacHighlights] = useState<AlmanacArticle[] | null>(null);
  const [daily, setDaily] = useState<DailyResponse | null>(null);
  const [activityCounts, setActivityCounts] = useState<Record<string, DayCounts>>({});
  const [streak, setStreak] = useState<number | null>(null);
  const { courses: allCourses } = useCurriculum();
  const { progressMap, refresh: refreshProgress } = useAllProgress();

  const allNonAlgoCourses = useMemo(() => {
    return allCourses.filter((c) => LISTED_COURSE_KEYS.includes(c.key));
  }, [allCourses]);

  const continueTo = useMemo(() => {
    if (!isLoggedIn || !allNonAlgoCourses.length) return null;
    let best: { course: Course; slug: string; title: string; pct: number; at: string } | null =
      null;
    for (const c of allNonAlgoCourses) {
      const p = progressMap[c.key];
      if (!p) continue;
      const pct = progressPct(p.completed, p.total);
      for (const l of p.lessons) {
        if (l.lastAccessedAt && (!best || l.lastAccessedAt > best.at)) {
          best = { course: c, slug: l.slug, title: l.title, pct, at: l.lastAccessedAt };
        }
      }
    }
    if (best) return { course: best.course, slug: best.slug, title: best.title, pct: best.pct };
    const first = allNonAlgoCourses[0];
    if (first?.lessons[0])
      return { course: first, slug: first.lessons[0].slug, title: first.lessons[0].title, pct: 0 };
    return null;
  }, [isLoggedIn, allNonAlgoCourses, progressMap]);

  const recentLessons = useMemo(() => {
    if (!isLoggedIn) return [];
    const items: { courseKey: string; slug: string; title: string; lastAccessedAt: string }[] = [];
    for (const [courseKey, p] of Object.entries(progressMap)) {
      if (isClosedCourse(courseKey)) continue;
      for (const l of p.lessons) {
        if (l.lastAccessedAt) {
          items.push({ courseKey, slug: l.slug, title: l.title, lastAccessedAt: l.lastAccessedAt });
        }
      }
    }
    items.sort((a, b) => b.lastAccessedAt.localeCompare(a.lastAccessedAt));
    // Beside Continue, so its lesson isn't listed again; a challenge opened
    // last stays, since Continue only goes to a course
    return items
      .filter((l) => !(l.courseKey === continueTo?.course.key && l.slug === continueTo.slug))
      .slice(0, 3);
  }, [isLoggedIn, progressMap, continueTo]);

  // The lesson/algo of the day are owned by the server (persisted per user per
  // day in the daily_picks table), so each is a single locked-in item that
  // stays put across completion and simply flips to a "completed" state once
  // done. We resolve its live completed state + course title from local data.
  const resolvePick = useMemo(() => {
    return (pick: DailyResponse['lesson']): ResolvedPick | null => {
      if (!pick) return null;
      const course = allCourses.find((c) => c.key === pick.courseKey);
      const lesson = course?.lessons.find((l) => l.slug === pick.slug);
      const completed =
        progressMap[pick.courseKey]?.lessons.find((l) => l.slug === pick.slug)?.completed ?? false;
      const sortOrder = lesson?.sortOrder ?? 1;
      // XP the user actually earns for the daily pick = base + daily bonus.
      const xp = xpForLesson(sortOrder) + dailyBonusXp(sortOrder);
      return {
        courseKey: pick.courseKey,
        courseTitle: course?.title ?? pick.courseKey,
        slug: pick.slug,
        title: lesson?.title ?? pick.title,
        completed,
        xp,
      };
    };
  }, [allCourses, progressMap]);

  const lessonOfTheDay = useMemo(() => resolvePick(daily?.lesson ?? null), [resolvePick, daily]);
  const algoOfTheDay = useMemo(() => resolvePick(daily?.algo ?? null), [resolvePick, daily]);

  useEffect(() => {
    if (isLoggedIn) refreshProgress();
  }, [isLoggedIn, refreshProgress]);

  // Lessons, algorithms and Laniakea tests, counted by the server as on the profile
  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    profileService
      .getActivity()
      .then((a) => {
        if (cancelled) return;
        setActivityCounts(bucketByLocalDay(a.activity));
        setStreak(a.streak);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    fetchDaily()
      .then((d) => {
        if (!cancelled) setDaily(d);
      })
      .catch(() => {
        if (!cancelled) setDaily(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    fetchAlmanacSlugs()
      .then((slugs) =>
        Promise.all(seededPick(slugs, 3, TODAY_SEED).map((s) => fetchAlmanacArticle(s, lang))),
      )
      .then((articles) => {
        if (!cancelled) setAlmanacHighlights(articles);
      })
      .catch(() => {
        if (!cancelled) setAlmanacHighlights([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, lang]);

  // While sign-in is still being checked, a browser that last saw a student
  // gets the dashboard's spinner; anyone else gets the landing page at once,
  // the same one the pre-rendered HTML already shows
  if (isLoading && !wasSignedIn()) return <LandingPage />;

  if (isLoading) {
    return <PageLoading />;
  }

  if (isLoggedIn && user) {
    const firstName = user.name?.trim().split(/\s+/)[0];
    // A new account is welcomed, not welcomed back, on its first day
    const greeting = isFirstDay(user.createdAt) ? 'homeNew' : 'home';
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
        <Topbar />

        <PageContainer>
          <h1 className="m-0 mb-6 text-2xl font-bold tracking-[-0.4px]">
            {firstName
              ? t(`pages.${greeting}Title`, { name: firstName })
              : t(`pages.${greeting}TitleNoName`)}
          </h1>
          <div className="space-y-5">
            {/* ── What to do next, and how far along ── */}
            <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-5">
              {continueTo && (
                <ContinueCard
                  courseKey={continueTo.course.key}
                  courseTitle={continueTo.course.title}
                  slug={continueTo.slug}
                  title={continueTo.title}
                  pct={continueTo.pct}
                  recent={recentLessons}
                />
              )}
              <StatsCard streak={streak} />
            </div>

            {/* ── Today's picks and Laniakea ── */}
            <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-5">
              {lessonOfTheDay && (
                <OfTheDayCard
                  heading={t('home.lessonOfTheDay')}
                  courseKey={lessonOfTheDay.courseKey}
                  courseTitle={lessonOfTheDay.courseTitle}
                  slug={lessonOfTheDay.slug}
                  title={lessonOfTheDay.title}
                  completed={lessonOfTheDay.completed}
                  xp={lessonOfTheDay.xp}
                  bonusRatio={daily?.bonusRatio ?? 0}
                  completedText={t('home.completedLessonToday')}
                  cta={t('home.startLesson')}
                />
              )}
              {algoOfTheDay && (
                <OfTheDayCard
                  heading={t('home.algoOfTheDay')}
                  courseKey={algoOfTheDay.courseKey}
                  courseTitle={algoOfTheDay.courseTitle}
                  slug={algoOfTheDay.slug}
                  title={algoOfTheDay.title}
                  completed={algoOfTheDay.completed}
                  xp={algoOfTheDay.xp}
                  bonusRatio={daily?.bonusRatio ?? 0}
                  completedText={t('home.completedAlgoToday')}
                  cta={t('home.solveChallenge')}
                />
              )}
              <LaniakeaCard />
            </div>

            <ActivityHeatmap activityCounts={activityCounts} months={HEATMAP_MONTHS} />

            {/* ── Almanac Highlights ── */}
            {almanacHighlights?.length !== 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <SectionHeader noMargin>{t('home.fromAlmanac')}</SectionHeader>
                  <button
                    onClick={() => navigate('/almanac')}
                    className="group inline-flex items-center gap-1 text-xs text-[var(--accent)] font-medium bg-transparent border-none cursor-pointer"
                  >
                    {t('home.viewAll')}
                    <ArrowRight
                      size={12}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
                <div className="grid grid-cols-1 @xl:grid-cols-3 gap-3.5">
                  {(almanacHighlights ?? [null, null, null]).map((a, i) => {
                    if (!a) {
                      return (
                        <div
                          key={i}
                          className="p-5 panel rounded-[var(--radius-lg)] animate-pulse h-[168px]"
                        />
                      );
                    }
                    const color = CAT_COLORS[a.cat] ?? '#6C5CE7';
                    return (
                      <button
                        key={i}
                        onClick={() => setAlmanacStory(a)}
                        className="text-left p-5 panel rounded-[var(--radius-lg)] hover:border-[var(--accent)] hover:-translate-y-0.5 transition cursor-pointer flex flex-col"
                      >
                        <div className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.8px] mb-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                          <span style={{ color }}>{a.tag}</span>
                        </div>
                        <div className="text-sm font-bold tracking-[-0.2px] leading-tight mb-1.5 line-clamp-2">
                          {a.title}
                        </div>
                        <div className="text-xs text-[var(--text2)] leading-relaxed flex-1 line-clamp-3 mb-2.5">
                          {a.excerpt}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[var(--text3)]">
                            {t('home.readTime', { time: a.readTime })}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)]">
                            {t('home.readMore')}
                            <ArrowRight size={11} aria-hidden="true" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </PageContainer>

        {almanacStory && <StoryModal story={almanacStory} onClose={() => setAlmanacStory(null)} />}
        {/* The admins' announcements and polls, once a story read here is closed */}
        <DashboardNotices held={!!almanacStory} />
      </div>
    );
  }

  // A visitor gets the landing page on the same address
  return <LandingPage />;
}

/* ── Helper Components ── */

function SectionHeader({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return <h2 className={`section-label ${noMargin ? '' : 'mb-3'}`}>{children}</h2>;
}

function formatTimeAgo(iso: string, t: TFunction): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return t('home.minAgo', { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('home.hourAgo', { count: hours });
  const days = Math.floor(hours / 24);
  return t('home.dayAgo', { count: days });
}

/* ── Continue ── */

// The lesson the student opened last, big, with how far along its course is
// and Continue; the few opened before it in a short list under it
function ContinueCard({
  courseKey,
  courseTitle,
  slug,
  title,
  pct,
  recent,
}: {
  courseKey: string;
  courseTitle: string;
  slug: string;
  title: string;
  pct: number;
  recent: { courseKey: string; slug: string; title: string; lastAccessedAt: string }[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { color } = courseMeta(courseKey);
  return (
    <div
      className="@3xl:col-span-2 p-5 panel rounded-[var(--radius-lg)] flex flex-col"
      style={{ backgroundImage: courseWash(courseKey) }}
    >
      <h2 className="section-label mb-4">{t('home.continueWhereLeftOff')}</h2>
      <div className="flex items-center gap-4">
        <CourseMark courseKey={courseKey} size={44} />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-[var(--text3)]">{courseTitle}</div>
          <div className="text-[18px] font-bold tracking-[-0.3px] truncate">{title}</div>
        </div>
        <button
          onClick={() => navigate(`/lesson/${courseKey}/${slug}`)}
          className="btn btn-primary flex-shrink-0 group"
        >
          {t('courses.continue')}
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-[var(--text3)] mb-1">
          <span>{t('courses.percentComplete', { pct })}</span>
        </div>
        <div className="h-1 bg-[var(--surface2)] rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-[width] duration-400"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
      {recent.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[var(--border)]">
          <h3 className="section-label mb-2">{t('home.recentlyAccessed')}</h3>
          <div className="grid grid-cols-1 @xl:grid-cols-3 gap-2">
            {recent.map((l) => (
              <button
                key={`${l.courseKey}/${l.slug}`}
                onClick={() => navigate(`/lesson/${l.courseKey}/${l.slug}`)}
                className="flex items-center gap-2.5 p-2 rounded-[var(--radius-sm)] bg-transparent border-none hover:bg-[var(--accent)]/5 transition cursor-pointer text-left text-[var(--text)] min-w-0"
              >
                <CourseMark courseKey={l.courseKey} size={24} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold truncate">{l.title}</div>
                  <div className="text-[10px] text-[var(--text3)] truncate">
                    {formatTimeAgo(l.lastAccessedAt, t)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Where the student stands ── */

// The level as a ring that fills toward the next one, its title and the XP
// still to go, then the days in a row, the lessons done and the badges on one
// line; the whole picture is on Progress
function StatsCard({ streak }: { streak: number | null }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const g = useGamification();
  const stats = [
    { icon: Flame, value: streak ?? '-', label: t('profile.streak') },
    { icon: BookCheck, value: g.totalCompleted, label: t('profile.lessonsDone') },
    { icon: Award, value: g.badges.filter((b) => b.earned).length, label: t('profile.badges') },
  ];
  return (
    <div className="p-5 panel rounded-[var(--radius-lg)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-label">{t('nav.progress')}</h2>
        <button
          onClick={() => navigate('/progress')}
          className="group inline-flex items-center gap-1 text-xs text-[var(--accent)] font-medium bg-transparent border-none cursor-pointer"
        >
          {t('home.viewAll')}
          <ArrowRight
            size={12}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
      <div className="flex-1 flex items-center gap-4 py-2">
        <LevelRing level={g.xp.level} pct={g.xp.xpPct} />
        <div className="min-w-0">
          <div className="text-[16px] font-bold tracking-[-0.2px] truncate">{t(g.xp.titleKey)}</div>
          <div className="mt-0.5 text-[12px] text-[var(--text3)]">
            {t('profile.levelProgress', {
              current: g.xp.xpIntoLevel,
              needed: g.xp.xpForLevelSpan,
              next: g.xp.level + 1,
            })}
          </div>
        </div>
      </div>
      <div className="pt-3">
        <div className="grid grid-cols-3 border-t border-[var(--border)] pt-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center text-center px-1 ${i > 0 ? 'border-l border-[var(--border)]' : ''}`}
            >
              <div className="flex items-center gap-1.5">
                <Icon size={14} className="text-[var(--accent)]" aria-hidden="true" />
                <span className="text-[17px] font-bold leading-none tabular-nums">{value}</span>
              </div>
              <div className="mt-1.5 text-[10px] text-[var(--text3)] leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// A ring around the level's number, filled as far as the student is toward
// the next level
function LevelRing({ level, pct }: { level: number; pct: number }) {
  const { t } = useTranslation();
  const r = 27;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative w-[72px] h-[72px] flex-shrink-0"
      role="img"
      aria-label={`${t('level.label', { n: level })}, ${pct}%`}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--surface2)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(Math.max(pct, 0), 100) / 100)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-[20px] font-bold leading-none">{level}</span>
        <span className="mt-0.5 text-[8px] font-semibold tracking-[1px] text-[var(--text3)] uppercase">
          {t('home.levelShort')}
        </span>
      </div>
    </div>
  );
}

/* ── Lesson / Algo of the Day ── */

function OfTheDayCard({
  heading,
  courseKey,
  courseTitle,
  slug,
  title,
  completed,
  xp,
  bonusRatio,
  completedText,
  cta,
}: {
  heading: string;
  courseKey: string;
  courseTitle: string;
  slug: string;
  title: string;
  completed: boolean;
  xp: number;
  bonusRatio: number;
  completedText: string;
  cta: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="p-5 panel rounded-[var(--radius-lg)] flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="section-label">{heading}</h3>
        {completed && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--success)] bg-[var(--success)]/15 px-2 py-0.5 rounded-full">
            <Check size={11} strokeWidth={3} aria-hidden="true" />
            {t('home.completed')}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <CourseMark courseKey={courseKey} size={36} />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-[var(--text3)] truncate">{courseTitle}</div>
          <div className="text-[14px] font-bold leading-snug line-clamp-2">{title}</div>
        </div>
      </div>
      <div className="mt-auto pt-5 flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-semibold ${completed ? 'text-[var(--success)]' : 'text-[var(--accent)]'}`}
        >
          {completed ? completedText : t('common.xpReward', { xp })}
          {!completed && bonusRatio > 0 && (
            <span className="font-medium text-[var(--text3)]">
              {' · '}
              {t('home.dailyBonusToday', { pct: Math.round(bonusRatio * 100) })}
            </span>
          )}
        </span>
        <button
          onClick={() => navigate(`/lesson/${courseKey}/${slug}`)}
          className="btn btn-secondary btn-sm flex-shrink-0 group"
        >
          {completed ? t('home.review') : cta}
          <ArrowRight
            size={12}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}
