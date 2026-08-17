import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ActivityHeatmap } from '../components/gamification/ActivityHeatmap';
import { bucketByLocalDay } from '../components/gamification/heatmap-utils';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import type { Course } from '../../shared/lesson';
import { courseMeta } from '../constants/courses';
import {
  MAIN_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
  progressPct,
  xpForLesson,
  dailyBonusXp,
} from '../../shared/constants';
import { StoryModal } from './StoryModal';
import { fetchAlmanacSlugs, fetchAlmanacArticle } from '../services/almanacService';
import type { AlmanacArticle } from '../../shared/almanac';
import { fetchDaily } from '../services/dailyService';
import type { DailyResponse } from '../../shared/daily';
import { Deco } from '../components/ui/Deco';

function extractActivityCounts(
  progressMap: Record<string, import('../../shared/progress').CourseProgress>,
): Record<string, number> {
  const timestamps: string[] = [];
  for (const p of Object.values(progressMap)) {
    for (const l of p.lessons) {
      if (l.completedAt) timestamps.push(l.completedAt);
    }
  }
  return bucketByLocalDay(timestamps);
}

const TODAY_SEED = Math.floor(Date.now() / 86400000);

const TAG_COLORS: Record<string, string> = {
  'OPEN SOURCE': '#00D68F',
  LEGENDS: '#a855f7',
  HARDWARE: '#FFAA00',
  HISTORY: '#3b82f6',
  INTERNET: '#06b6d4',
  SECURITY: '#ef4444',
  'AI & FUTURE': '#8b5cf6',
  SPACE: '#6366f1',
  TOOLS: '#f59e0b',
  LANGUAGES: '#10b981',
  PLATFORMS: '#ec4899',
  PROTOCOLS: '#14b8a6',
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

export function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ro' ? 'ro' : 'en';
  const { isLoggedIn, isLoading, user } = useAuth();
  const [almanacStory, setAlmanacStory] = useState<AlmanacArticle | null>(null);
  const [almanacHighlights, setAlmanacHighlights] = useState<AlmanacArticle[] | null>(null);
  const [daily, setDaily] = useState<DailyResponse | null>(null);
  const { courses: allCourses } = useCurriculum();
  const { progressMap, refresh: refreshProgress } = useAllProgress();

  const activityCounts = useMemo(() => extractActivityCounts(progressMap), [progressMap]);

  const allNonAlgoCourses = useMemo(() => {
    const keys = [...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS] as readonly string[];
    return allCourses.filter((c) => keys.includes(c.key));
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
      for (const l of p.lessons) {
        if (l.lastAccessedAt) {
          items.push({ courseKey, slug: l.slug, title: l.title, lastAccessedAt: l.lastAccessedAt });
        }
      }
    }
    items.sort((a, b) => b.lastAccessedAt.localeCompare(a.lastAccessedAt));
    return items.slice(0, 4);
  }, [isLoggedIn, progressMap]);

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
        title: pick.title,
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

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-transparent">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
        <Topbar />

        <main className="flex-1 px-4 sm:px-6 py-8">
          <div className="max-w-[1040px] mx-auto space-y-6">
            {/* ── Continue Where You Left Off + Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {continueTo && (
                <div className="p-5 panel rounded-[var(--radius)] flex flex-col">
                  <h3 className="text-[11px] font-semibold tracking-[1px] text-[var(--text3)] mb-3.5">
                    {t('home.continueWhereLeftOff')}
                  </h3>
                  <button
                    onClick={() => navigate(`/lesson/${continueTo.course.key}/${continueTo.slug}`)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-[var(--radius-sm)] hover:bg-[var(--accent)]/5 transition cursor-pointer group"
                  >
                    <Deco
                      as="div"
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg shrink-0"
                      style={{ background: courseMeta(continueTo.course.key).color + '20' }}
                    >
                      {courseMeta(continueTo.course.key).icon}
                    </Deco>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold tracking-[0.5px] rounded-full bg-[var(--accent)]/15 text-[var(--accent)] mb-1">
                        {continueTo.course.title}
                      </span>
                      <div className="font-semibold text-[14px] truncate">{continueTo.title}</div>
                    </div>
                  </button>

                  {recentLessons.length > 1 && (
                    <>
                      <div className="border-t border-[var(--border)] my-3" />
                      <h4 className="text-[10px] font-semibold tracking-[0.5px] text-[var(--text3)] mb-2">
                        {t('home.recentlyAccessed')}
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {recentLessons.slice(1, 4).map((l, i) => {
                          const meta = courseMeta(l.courseKey);
                          return (
                            <button
                              key={i}
                              onClick={() => navigate(`/lesson/${l.courseKey}/${l.slug}`)}
                              className="flex items-center gap-2.5 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--accent)]/5 transition cursor-pointer text-left"
                            >
                              <Deco
                                as="div"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                                style={{ background: meta.color + '20' }}
                              >
                                {meta.icon}
                              </Deco>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-semibold truncate">{l.title}</div>
                                <div className="text-[10px] text-[var(--text3)]">
                                  {meta.label} · {formatTimeAgo(l.lastAccessedAt, t)}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              <ActivityHeatmap activityCounts={activityCounts} />
            </div>

            {/* ── Lesson + Algo of the Day (stacked) + Course Milestones ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {(lessonOfTheDay || algoOfTheDay) && (
                <div className="flex flex-col gap-5">
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
                      subtitle={t('home.continueJourney', { course: lessonOfTheDay.courseTitle })}
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
                      subtitle={t('home.algoChallengeToday')}
                      completedText={t('home.completedAlgoToday')}
                      cta={t('home.solveChallenge')}
                    />
                  )}
                </div>
              )}
              <CourseMilestones courses={allNonAlgoCourses} progressMap={progressMap} />
            </div>

            {/* ── Almanac Highlights ── */}
            {almanacHighlights?.length !== 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <SectionHeader noMargin>{t('home.fromAlmanac')}</SectionHeader>
                  <button
                    onClick={() => navigate('/almanac')}
                    className="text-xs text-[var(--accent)] font-medium hover:underline cursor-pointer"
                  >
                    {t('home.viewAll')}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {(almanacHighlights ?? [null, null, null]).map((a, i) => {
                    if (!a) {
                      return (
                        <div
                          key={i}
                          className="p-5 panel rounded-[var(--radius)] animate-pulse h-[168px]"
                        />
                      );
                    }
                    const color = TAG_COLORS[a.tag ?? ''] ?? '#6C5CE7';
                    return (
                      <button
                        key={i}
                        onClick={() => setAlmanacStory(a)}
                        className="text-left p-5 panel rounded-[var(--radius)] hover:border-[var(--accent)] hover:-translate-y-0.5 transition cursor-pointer flex flex-col"
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
                          <span className="text-[11px] font-semibold text-[var(--accent)]">
                            {t('home.readMore')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </main>

        {almanacStory && <StoryModal story={almanacStory} onClose={() => setAlmanacStory(null)} />}
      </div>
    );
  }

  // ── Logged-out marketing view ──
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full text-center">
          <svg
            className="inline-block w-16 h-16 mb-6"
            viewBox="0 0 64 64"
            style={{ filter: 'drop-shadow(0 0 24px var(--accent-glow))' }}
          >
            <polygon
              points="32,4 39,24 60,24 43,37 49,58 32,46 15,58 21,37 4,24 25,24"
              fill="var(--accent)"
            />
          </svg>

          <h1 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.5px] mb-3">
            {t('home.marketing.title')}
          </h1>
          <p className="text-[var(--text2)] text-base sm:text-lg mb-10">
            <Trans
              i18nKey="home.marketing.subtitle"
              components={{
                1: <span className="text-[var(--text)] font-semibold" />,
                3: <span className="text-[var(--text)] font-semibold" />,
                5: <span className="text-[var(--text)] font-semibold" />,
                7: <span className="text-[var(--text)] font-semibold" />,
              }}
            />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
            >
              {t('home.marketing.startLearning')}
            </button>
            <button
              onClick={() => navigate('/getstarted')}
              className="px-6 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer"
            >
              {t('home.marketing.signIn')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 max-w-4xl mx-auto text-left">
            <div className="p-5 panel rounded-[var(--radius)]">
              <Deco as="div" className="text-2xl mb-2">
                📖
              </Deco>
              <div className="font-semibold mb-1">{t('home.marketing.readCard')}</div>
              <div className="text-sm text-[var(--text2)]">{t('home.marketing.readCardDesc')}</div>
            </div>
            <div className="p-5 panel rounded-[var(--radius)]">
              <Deco as="div" className="text-2xl mb-2">
                ⌨️
              </Deco>
              <div className="font-semibold mb-1">{t('home.marketing.writeCard')}</div>
              <div className="text-sm text-[var(--text2)]">{t('home.marketing.writeCardDesc')}</div>
            </div>
            <div className="p-5 panel rounded-[var(--radius)]">
              <Deco as="div" className="text-2xl mb-2">
                ⚡
              </Deco>
              <div className="font-semibold mb-1">{t('home.marketing.runCard')}</div>
              <div className="text-sm text-[var(--text2)]">{t('home.marketing.runCardDesc')}</div>
            </div>
            <div className="p-5 panel rounded-[var(--radius)]">
              <Deco as="div" className="text-2xl mb-2">
                ⭐
              </Deco>
              <div className="font-semibold mb-1">{t('home.marketing.levelCard')}</div>
              <div className="text-sm text-[var(--text2)]">{t('home.marketing.levelCardDesc')}</div>
            </div>
          </div>
        </div>
      </main>

      {almanacStory && <StoryModal story={almanacStory} onClose={() => setAlmanacStory(null)} />}
    </div>
  );
}

/* ── Helper Components ── */

function SectionHeader({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <h2
      className={`text-[11px] font-semibold tracking-[1px] text-[var(--text3)] ${noMargin ? '' : 'mb-3'}`}
    >
      {children}
    </h2>
  );
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
  subtitle,
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
  subtitle: string;
  completedText: string;
  cta: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const meta = courseMeta(courseKey);
  return (
    <div className="p-5 panel rounded-[var(--radius)] flex flex-col flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-semibold tracking-[1px] text-[var(--text3)]">{heading}</h3>
        {completed ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--success)] bg-[rgba(0,214,143,0.12)] px-2 py-0.5 rounded-full tracking-[0.5px]">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                clipRule="evenodd"
              />
            </svg>
            {t('home.completed')}
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-[var(--warning)] bg-[rgba(255,170,0,0.12)] px-2 py-0.5 rounded-full tracking-[0.5px]">
            {t('home.recommended')}
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          <Deco
            as="div"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
            style={{ background: meta.color + '20' }}
          >
            {meta.icon}
          </Deco>
          <span className="text-[11px] text-[var(--text3)] font-medium">{courseTitle}</span>
          {!completed && (
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent)]/12 px-2 py-0.5 rounded-full tracking-[0.5px]">
              <Deco>⭐</Deco>
              {t('home.dailyXp', { xp })}
              {bonusRatio > 0 && (
                <span className="text-[var(--text3)]">
                  {' '}
                  ({t('home.dailyBonus', { pct: Math.round(bonusRatio * 100) })})
                </span>
              )}
            </span>
          )}
        </div>
        <div className="text-base font-bold tracking-[-0.2px] leading-tight mb-1.5">{title}</div>
        <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-4">
          {completed ? completedText : subtitle}
        </p>
      </div>
      <button
        onClick={() => navigate(`/lesson/${courseKey}/${slug}`)}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-white rounded-[var(--radius-sm)] text-xs font-semibold hover:brightness-110 transition cursor-pointer self-start"
      >
        {completed ? t('home.review') : cta}
      </button>
    </div>
  );
}

/* ── Course Milestones ── */

function CourseMilestones({
  courses,
  progressMap,
}: {
  courses: Course[];
  progressMap: Record<string, import('../../shared/progress').CourseProgress>;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const active = courses.filter((c) => progressMap[c.key]?.completed);
  const notStarted = courses.filter((c) => !progressMap[c.key]?.completed);

  return (
    <div className="p-5 panel rounded-[var(--radius)] flex flex-col">
      <div className="mb-4">
        <h3 className="text-[11px] font-semibold tracking-[1px] text-[var(--text3)]">
          {t('home.courseMilestones')}
        </h3>
      </div>
      <div className="flex flex-col gap-3.5 flex-1">
        {active.map((c) => {
          const p = progressMap[c.key]!;
          const pct = progressPct(p.completed, p.total);
          const remaining = p.total - p.completed;
          const meta = courseMeta(c.key);
          const nextLesson = c.lessons.find((l) => {
            const lp = p.lessons.find((pl) => pl.slug === l.slug);
            return !lp?.completed;
          });
          return (
            <button
              key={c.key}
              onClick={() => navigate(`/courses?open=${c.key}`)}
              className="flex items-center gap-3 text-left cursor-pointer hover:opacity-80 transition"
            >
              <Deco
                as="div"
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0"
                style={{ background: meta.color + '20' }}
              >
                {meta.icon}
              </Deco>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold">{meta.label}</div>
                <div className="text-[11px] text-[var(--text2)] mb-1.5">
                  <Trans
                    i18nKey="home.lessonsRemaining"
                    count={remaining}
                    values={{ count: remaining }}
                    components={[<strong className="text-[var(--text)] font-semibold" />]}
                  />
                  {nextLesson && (
                    <>
                      {' '}
                      · {t('home.next')}{' '}
                      <strong className="text-[var(--text)] font-semibold">
                        {nextLesson.title}
                      </strong>
                    </>
                  )}
                </div>
                <div className="h-1 bg-[var(--bg3)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-600"
                    style={{ width: `${pct}%`, background: meta.color }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-[var(--text2)] shrink-0 min-w-[32px] text-right">
                {pct}%
              </span>
            </button>
          );
        })}
        {notStarted.map((c) => {
          const meta = courseMeta(c.key);
          return (
            <button
              key={c.key}
              onClick={() => navigate(`/courses?open=${c.key}`)}
              className="flex items-center gap-3 opacity-60 text-left cursor-pointer hover:opacity-80 transition"
            >
              <Deco
                as="div"
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0"
                style={{ background: meta.color + '20' }}
              >
                {meta.icon}
              </Deco>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold">{meta.label}</div>
                <div className="text-[11px] text-[var(--text2)] mb-1.5">
                  {t('home.notStarted', { count: c.lessons.length })}
                </div>
                <div className="h-1 bg-[var(--bg3)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
