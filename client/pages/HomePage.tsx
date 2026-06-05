import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import type { Course } from '../../shared/lesson';
import { courseMeta } from '../constants/courses';
import { MAIN_COURSE_KEYS, TERMINAL_COURSE_KEYS, progressPct } from '../../shared/constants';
import { StoryModal } from './StoryModal';
import { HERO as ALMANAC_HERO, ARTICLES as ALMANAC_ARTICLES_RAW } from './almanacData';
import type { StoryData } from './almanacData';
import { AI_ARTICLES } from './almanacAIArticles';

function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function extractActivityCounts(
  progressMap: Record<string, import('../../shared/progress').CourseProgress>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of Object.values(progressMap)) {
    for (const l of p.lessons) {
      if (l.completedAt) {
        const day = localDateStr(new Date(l.completedAt));
        counts[day] = (counts[day] ?? 0) + 1;
      }
    }
  }
  return counts;
}

const HEATMAP_COLORS = [
  'rgba(30,30,40,0.4)',
  'rgba(108,92,231,0.25)',
  'rgba(108,92,231,0.5)',
  'rgba(108,92,231,0.85)',
];

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

const ALL_ALMANAC_POOL: StoryData[] = [ALMANAC_HERO, ...ALMANAC_ARTICLES_RAW, ...AI_ARTICLES];

const ALMANAC_HIGHLIGHTS = seededPick(ALL_ALMANAC_POOL, 3, TODAY_SEED);

export function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, user } = useAuth();
  const [almanacStory, setAlmanacStory] = useState<StoryData | null>(null);
  const { courses: allCourses } = useCurriculum();
  const { progressMap, refresh: refreshProgress } = useAllProgress();

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

  const lessonOfTheDay = useMemo(() => {
    if (!isLoggedIn || !allNonAlgoCourses.length) return null;
    const incomplete: { course: Course; slug: string; title: string }[] = [];
    for (const c of allNonAlgoCourses) {
      const p = progressMap[c.key];
      const doneSet = new Set(p?.lessons.filter((l) => l.completed).map((l) => l.slug));
      for (const l of c.lessons) {
        if (!doneSet.has(l.slug)) {
          incomplete.push({ course: c, slug: l.slug, title: l.title });
        }
      }
    }
    if (!incomplete.length) return null;
    return incomplete[TODAY_SEED % incomplete.length];
  }, [isLoggedIn, allNonAlgoCourses, progressMap]);

  useEffect(() => {
    if (isLoggedIn) refreshProgress();
  }, [isLoggedIn, refreshProgress]);

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
                <div className="p-5 border border-[var(--accent)]/30 rounded-[var(--radius)] backdrop-blur-[12px] bg-[rgba(22,22,29,0.1)] flex flex-col">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3.5">
                    Continue where you left off
                  </h3>
                  <button
                    onClick={() => navigate(`/lesson/${continueTo.course.key}/${continueTo.slug}`)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-[var(--radius-sm)] hover:bg-[var(--accent)]/5 transition cursor-pointer group"
                  >
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg shrink-0"
                      style={{ background: courseMeta(continueTo.course.key).color + '20' }}
                    >
                      {courseMeta(continueTo.course.key).icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] rounded-full bg-[var(--accent)]/15 text-[var(--accent)] mb-1">
                        {continueTo.course.title}
                      </span>
                      <div className="font-semibold text-[14px] truncate">{continueTo.title}</div>
                    </div>
                  </button>

                  {recentLessons.length > 1 && (
                    <>
                      <div className="border-t border-[var(--accent)]/20 my-3" />
                      <h4 className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[var(--text3)] mb-2">
                        Recently accessed
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
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                                style={{ background: meta.color + '20' }}
                              >
                                {meta.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-semibold truncate">{l.title}</div>
                                <div className="text-[10px] text-[var(--text3)]">
                                  {meta.label} · {formatTimeAgo(l.lastAccessedAt)}
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

              <ActivityHeatmap progressMap={progressMap} />
            </div>

            {/* ── Lesson of the Day + Course Milestones ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {lessonOfTheDay && (
                <LessonOfTheDay
                  course={lessonOfTheDay.course}
                  slug={lessonOfTheDay.slug}
                  title={lessonOfTheDay.title}
                />
              )}
              <CourseMilestones courses={allNonAlgoCourses} progressMap={progressMap} />
            </div>

            {/* ── Almanac Highlights ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <SectionHeader noMargin>From the Almanac</SectionHeader>
                <button
                  onClick={() => navigate('/almanac')}
                  className="text-xs text-[var(--accent)] font-medium hover:underline cursor-pointer"
                >
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {ALMANAC_HIGHLIGHTS.map((a, i) => {
                  const color = TAG_COLORS[a.tag ?? ''] ?? '#6C5CE7';
                  return (
                    <button
                      key={i}
                      onClick={() => setAlmanacStory(a)}
                      className="text-left p-5 border border-[var(--accent)]/30 rounded-[var(--radius)] backdrop-blur-[12px] bg-[rgba(22,22,29,0.1)] hover:border-[var(--accent)] hover:-translate-y-0.5 transition cursor-pointer flex flex-col"
                    >
                      <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.8px] mb-2">
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
                        <span className="text-[11px] text-[var(--text3)]">{a.readTime} read</span>
                        <span className="text-[11px] font-semibold text-[var(--accent)]">
                          Read →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
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
            Learn to code, for free
          </h1>
          <p className="text-[var(--text2)] text-base sm:text-lg mb-10">
            Interactive lessons in <span className="text-[var(--text)] font-semibold">Python</span>,{' '}
            <span className="text-[var(--text)] font-semibold">Java</span>,{' '}
            <span className="text-[var(--text)] font-semibold">C</span>, and{' '}
            <span className="text-[var(--text)] font-semibold">Linux</span>. Read, write, run — all
            in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
            >
              Start Learning →
            </button>
            <button
              onClick={() => navigate('/getstarted')}
              className="px-6 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer"
            >
              Sign in
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-3xl mx-auto text-left">
            <div className="p-5 border border-[var(--accent)]/30 rounded-[var(--radius)] backdrop-blur-[12px] bg-[rgba(22,22,29,0.1)]">
              <div className="text-2xl mb-2">📖</div>
              <div className="font-semibold mb-1">Read</div>
              <div className="text-sm text-[var(--text2)]">Bite-sized lessons explained simply</div>
            </div>
            <div className="p-5 border border-[var(--accent)]/30 rounded-[var(--radius)] backdrop-blur-[12px] bg-[rgba(22,22,29,0.1)]">
              <div className="text-2xl mb-2">⌨️</div>
              <div className="font-semibold mb-1">Write</div>
              <div className="text-sm text-[var(--text2)]">
                Interactive editor right in the browser
              </div>
            </div>
            <div className="p-5 border border-[var(--accent)]/30 rounded-[var(--radius)] backdrop-blur-[12px] bg-[rgba(22,22,29,0.1)]">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold mb-1">Run</div>
              <div className="text-sm text-[var(--text2)]">
                Real code execution with instant feedback
              </div>
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
      className={`text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] ${noMargin ? '' : 'mb-3'}`}
    >
      {children}
    </h2>
  );
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Activity Heatmap ── */

interface HeatmapDay {
  date: string;
  level: number;
  count: number;
  isFuture: boolean;
}

function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
}

function buildHeatmapData(activityCounts: Record<string, number>, weeks: number): HeatmapDay[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = localDateStr(today);

  const todayDow = today.getDay();
  const endSunday = new Date(today);
  endSunday.setDate(endSunday.getDate() + (todayDow === 0 ? 0 : 7 - todayDow));

  const start = new Date(endSunday);
  start.setDate(start.getDate() - weeks * 7 + 1);

  const data: HeatmapDay[][] = [];
  const current = new Date(start);
  for (let w = 0; w < weeks; w++) {
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = localDateStr(current);
      const isFuture = dateStr > todayStr;
      const count = isFuture ? 0 : (activityCounts[dateStr] ?? 0);
      const level = countToLevel(count);
      week.push({ date: dateStr, level, count, isFuture });
      current.setDate(current.getDate() + 1);
    }
    data.push(week);
  }
  return data;
}

function getMonthLabels(data: HeatmapDay[][]): { month: string; col: number }[] {
  const labels: { month: string; col: number }[] = [];
  let lastMonth = -1;
  data.forEach((week, i) => {
    const d = new Date(week[0].date);
    const m = d.getMonth();
    if (m !== lastMonth) {
      labels.push({ month: d.toLocaleString('en', { month: 'short' }), col: i });
      lastMonth = m;
    }
  });
  return labels;
}

function ActivityHeatmap({
  progressMap,
}: {
  progressMap: Record<string, import('../../shared/progress').CourseProgress>;
}) {
  const weeks = 20;
  const activityCounts = useMemo(() => extractActivityCounts(progressMap), [progressMap]);
  const data = useMemo(() => buildHeatmapData(activityCounts, weeks), [activityCounts, weeks]);
  const monthLabels = useMemo(() => getMonthLabels(data), [data]);
  const totalActive = data.flat().filter((d) => d.level > 0).length;
  const colWidth = 19;

  return (
    <div className="p-5 border border-[var(--accent)]/30 rounded-[var(--radius)] backdrop-blur-[12px] bg-[rgba(22,22,29,0.1)]">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)]">
          Activity
        </h3>
        <span className="text-xs text-[var(--text2)]">
          <strong className="text-[var(--text)] font-semibold">{totalActive}</strong> active days in
          the last {weeks} weeks
        </span>
      </div>

      {/* Month labels */}
      <div className="flex" style={{ paddingLeft: 30 }}>
        {monthLabels.map((m, i) => {
          const nextCol = monthLabels[i + 1]?.col ?? weeks;
          return (
            <div
              key={i}
              className="text-[9px] text-[var(--text3)] font-medium"
              style={{ width: (nextCol - m.col) * colWidth }}
            >
              {m.month}
            </div>
          );
        })}
      </div>

      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1.5 shrink-0">
          {['', 'Tue', '', 'Thu', '', 'Sat', ''].map((label, i) => (
            <div
              key={i}
              className="h-4 flex items-center text-[9px] text-[var(--text3)] font-medium"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] overflow-x-auto pb-1">
          {data.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="w-4 h-4 rounded-[3px] transition-all hover:outline hover:outline-2 hover:outline-[var(--accent)] hover:outline-offset-1"
                  style={{
                    background: day.isFuture ? 'transparent' : HEATMAP_COLORS[day.level],
                    border: day.isFuture ? '1px dashed rgba(102,102,128,0.15)' : 'none',
                  }}
                  title={`${day.date}: ${day.count === 0 ? 'No activity' : `${day.count} lesson${day.count === 1 ? '' : 's'} completed`}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-2.5">
        <span className="text-[10px] text-[var(--text3)]">Less</span>
        <div className="flex gap-[3px]">
          {HEATMAP_COLORS.map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <span className="text-[10px] text-[var(--text3)]">More</span>
      </div>
    </div>
  );
}

/* ── Lesson of the Day ── */

function LessonOfTheDay({ course, slug, title }: { course: Course; slug: string; title: string }) {
  const navigate = useNavigate();
  const meta = courseMeta(course.key);
  return (
    <div className="p-5 border border-[var(--accent)]/30 rounded-[var(--radius)] backdrop-blur-[12px] bg-[rgba(22,22,29,0.1)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)]">
          Lesson of the Day
        </h3>
        <span className="text-[10px] font-semibold text-[var(--warning)] bg-[rgba(255,170,0,0.12)] px-2 py-0.5 rounded-full uppercase tracking-[0.5px]">
          Recommended
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
            style={{ background: meta.color + '20' }}
          >
            {meta.icon}
          </div>
          <span className="text-[11px] text-[var(--text3)] font-medium">{course.title}</span>
        </div>
        <div className="text-base font-bold tracking-[-0.2px] leading-tight mb-1.5">{title}</div>
        <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-4">
          Continue your {course.title} journey with this lesson.
        </p>
      </div>
      <button
        onClick={() => navigate(`/lesson/${course.key}/${slug}`)}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-white rounded-[var(--radius-sm)] text-xs font-semibold hover:brightness-110 transition cursor-pointer self-start"
      >
        Start Lesson →
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
  const active = courses.filter((c) => progressMap[c.key]?.completed);
  const notStarted = courses.filter((c) => !progressMap[c.key]?.completed);

  return (
    <div className="p-5 border border-[var(--accent)]/30 rounded-[var(--radius)] backdrop-blur-[12px] bg-[rgba(22,22,29,0.1)] flex flex-col">
      <div className="mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)]">
          Course Milestones
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
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0"
                style={{ background: meta.color + '20' }}
              >
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold">{meta.label}</div>
                <div className="text-[11px] text-[var(--text2)] mb-1.5">
                  <strong className="text-[var(--text)] font-semibold">{remaining}</strong>{' '}
                  {remaining === 1 ? 'lesson' : 'lessons'} remaining
                  {nextLesson && (
                    <>
                      {' '}
                      · next:{' '}
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
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0"
                style={{ background: meta.color + '20' }}
              >
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold">{meta.label}</div>
                <div className="text-[11px] text-[var(--text2)] mb-1.5">
                  Not started yet · {c.lessons.length} lessons
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
