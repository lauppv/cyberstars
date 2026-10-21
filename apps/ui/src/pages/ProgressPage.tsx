import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';
import { BetaBadge } from '../components/ui/BetaBadge';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import type { Course } from '@cyberstars/shared/lesson';
import type { CourseProgress } from '@cyberstars/shared/progress';
import { courseMeta, courseTitle } from '../constants/courses';
import {
  ALGO_COURSE_KEYS,
  MAIN_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
  isBeta,
  progressPct,
} from '@cyberstars/shared/constants';

const DIFFICULTIES = [
  { key: 'easy', color: 'var(--success)' },
  { key: 'medium', color: 'var(--warning)' },
  { key: 'hard', color: 'var(--error)' },
] as const;

// A challenge's title starts with its difficulty, in English in both languages
function difficultyOf(title: string): string {
  return title.match(/^(Easy|Medium|Hard)\s*·/i)?.[1].toLowerCase() ?? 'easy';
}

// How far along each course and challenge set is
export function ProgressPage() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const { courses: allCourses } = useCurriculum();
  const { progressMap, refresh: refreshProgress } = useAllProgress();

  const [courses, algos] = useMemo(() => {
    const pick = (keys: readonly string[]) =>
      keys.map((key) => allCourses.find((c) => c.key === key)).filter((c): c is Course => !!c);
    return [pick([...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]), pick(ALGO_COURSE_KEYS)];
  }, [allCourses]);

  useEffect(() => {
    if (isLoggedIn) refreshProgress();
  }, [isLoggedIn, refreshProgress]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-[880px] mx-auto space-y-8">
          <section>
            <SectionHeader>{t('progress.courses')}</SectionHeader>
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
              {courses.map((c) => (
                <CourseCard key={c.key} course={c} progress={progressMap[c.key]} />
              ))}
            </div>
          </section>
          <section>
            <SectionHeader>{t('progress.algorithms')}</SectionHeader>
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
              {algos.map((c) => (
                <AlgoCard key={c.key} course={c} progress={progressMap[c.key]} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ children }: { children: string }) {
  return (
    <h2 className="text-[11px] font-semibold tracking-[1px] text-[var(--text3)] mb-3">
      {children}
    </h2>
  );
}

function completedSlugs(progress: CourseProgress | undefined): Set<string> {
  return new Set((progress?.lessons ?? []).filter((l) => l.completed).map((l) => l.slug));
}

// A card tinted with its course's colour, around a ring of how much is done
function Card({
  course,
  pct,
  onClick,
  children,
}: {
  course: Course;
  pct: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { color } = courseMeta(course.key);
  return (
    <button
      type="button"
      onClick={onClick}
      className="panel w-full p-5 flex gap-4 text-left cursor-pointer transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
      style={{ backgroundImage: `linear-gradient(135deg, ${color}26, transparent 60%)` }}
    >
      <Ring pct={pct} color={color} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[15px] font-bold tracking-[-0.2px] truncate">
            {courseTitle(course.key, t)}
          </span>
          {isBeta(course.key) && <BetaBadge />}
          <span className="ml-auto pl-2 text-[15px] font-bold tabular-nums" style={{ color }}>
            {pct}%
          </span>
        </div>
        {children}
      </div>
    </button>
  );
}

function Ring({ pct, color }: { pct: number; color: string }) {
  const r = 26;
  const length = 2 * Math.PI * r;
  return (
    <div className="w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--bg3)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - pct / 100)}
          className="transition-[stroke-dashoffset] duration-700"
          opacity={pct === 0 ? 0 : 1}
        />
      </svg>
    </div>
  );
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden bg-[var(--bg3)]">
      <div
        className="h-full rounded-full transition-[width] duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function CourseCard({ course, progress }: { course: Course; progress?: CourseProgress }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const done = completedSlugs(progress);
  const total = course.lessons.length;
  const pct = progressPct(done.size, total);
  const next = course.lessons.find((l) => !done.has(l.slug));
  const { color } = courseMeta(course.key);
  return (
    <Card course={course} pct={pct} onClick={() => navigate(`/courses/${course.key}`)}>
      <div className="text-[12px] text-[var(--text2)] mb-2.5 flex flex-wrap gap-x-2">
        <span>{t('progress.lessons', { done: done.size, total })}</span>
        {progress && progress.totalXp > 0 && (
          <span className="text-[var(--text3)]">
            {t('progress.xp', { earned: progress.earnedXp, total: progress.totalXp })}
          </span>
        )}
      </div>
      <Bar pct={pct} color={color} />
      <div className="text-[12px] text-[var(--text2)] mt-2.5 truncate">
        {done.size === 0 ? (
          t('progress.notStarted')
        ) : next ? (
          <Trans
            i18nKey="progress.next"
            values={{ title: next.title }}
            components={[<strong className="text-[var(--text)] font-semibold" />]}
          />
        ) : (
          <span style={{ color }}>{t('progress.completed')}</span>
        )}
      </div>
    </Card>
  );
}

function AlgoCard({ course, progress }: { course: Course; progress?: CourseProgress }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const done = completedSlugs(progress);
  const total = course.lessons.length;
  const solved = course.lessons.filter((l) => done.has(l.slug)).length;
  return (
    <Card
      course={course}
      pct={progressPct(solved, total)}
      onClick={() => navigate(`/algorithms/${course.key.replace(/^algo-/, '')}`)}
    >
      <div className="text-[12px] text-[var(--text2)] mb-2.5">
        {t('progress.solved', { done: solved, total })}
      </div>
      <div className="flex flex-col gap-1.5">
        {DIFFICULTIES.map(({ key, color }) => {
          const lessons = course.lessons.filter((l) => difficultyOf(l.title) === key);
          if (lessons.length === 0) return null;
          const n = lessons.filter((l) => done.has(l.slug)).length;
          return (
            <div
              key={key}
              className="grid grid-cols-[56px_1fr_40px] items-center gap-2 text-[11px]"
            >
              <span className="font-semibold" style={{ color }}>
                {t(`algoList.filters.${key}`)}
              </span>
              <Bar pct={progressPct(n, lessons.length)} color={color} />
              <span className="text-right tabular-nums text-[var(--text3)]">
                {n}/{lessons.length}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
