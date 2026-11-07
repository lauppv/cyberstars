import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';

import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { courseMeta, courseTitle, courseWash } from '../constants/courses';
import { isBeta, progressPct, xpForLesson } from '@cyberstars/shared/constants';
import { BetaBadge } from '../components/ui/BetaBadge';
import { CourseMark } from '../components/ui/CourseMark';
import { DifficultyFilters } from '../components/ui/DifficultyFilters';
import { DIFF_COLORS, type DifficultyFilter } from '../constants/difficulty';

function parseDifficulty(title: string): { diff: 'easy' | 'medium' | 'hard'; name: string } {
  const m = title.match(/^(Easy|Medium|Hard)\s*·\s*(.+)$/i);
  if (!m) return { diff: 'easy', name: title };
  return { diff: m[1].toLowerCase() as 'easy' | 'medium' | 'hard', name: m[2] };
}

export function AlgorithmListPage() {
  const { lang = '' } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const { courses, isLoading: curriculumLoading } = useCurriculum();
  const { progressMap, isLoading: progressLoading } = useAllProgress();
  const [filter, setFilter] = useState<DifficultyFilter>('all');

  const courseKey = `algo-${lang}`;
  const course = courses.find((c) => c.key === courseKey) ?? null;
  const progress = progressMap[courseKey] ?? null;

  const completedSlugs = useMemo(
    () => new Set((progress?.lessons ?? []).filter((l) => l.completed).map((l) => l.slug)),
    [progress],
  );

  const lessons = useMemo(() => {
    if (!course) return [];
    return course.lessons.map((l) => {
      const { diff, name } = parseDifficulty(l.title);
      return { ...l, diff, displayName: name, completed: completedSlugs.has(l.slug) };
    });
  }, [course, completedSlugs]);

  const filtered = useMemo(
    () => (filter === 'all' ? lessons : lessons.filter((l) => l.diff === filter)),
    [lessons, filter],
  );

  const isLoading = curriculumLoading || (isLoggedIn && progressLoading);

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

  if (!course) {
    return (
      <div className="h-screen flex flex-col bg-transparent text-[var(--text)]">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--text2)]">{t('algoList.courseNotFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div
          className="panel rounded-[14px] overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          {/* Header */}
          <div
            className="px-6 pt-6 pb-4 border-b border-[var(--border)]"
            style={{ backgroundImage: courseWash(courseKey) }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CourseMark courseKey={courseKey} size={40} />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold flex items-center gap-2">
                  {courseTitle(courseKey, t)}
                  {isBeta(courseKey) && <BetaBadge />}
                </h1>
                <p className="text-[var(--text3)] text-xs">
                  {t('algoList.challenges', { count: lessons.length })}
                </p>
              </div>
            </div>

            {/* Counted on the server, so a solved challenge that left the curriculum still counts */}
            {isLoggedIn && progress && (
              <div className="mb-4">
                <div className="text-[11px] text-[var(--text3)] mb-1">
                  {t('progress.solved', { done: progress.completed, total: progress.total })}
                </div>
                <div className="h-1 bg-[var(--bg3)] rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-[width] duration-400"
                    style={{
                      width: `${progressPct(progress.completed, progress.total)}%`,
                      background: courseMeta(courseKey).color,
                    }}
                  />
                </div>
              </div>
            )}

            <DifficultyFilters value={filter} onChange={setFilter} />
          </div>

          {/* List */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
            {filtered.length === 0 && (
              <p className="text-center text-[var(--text3)] text-sm py-6">
                {t('algoList.noMatch')}
              </p>
            )}
            {filtered.map((lesson, idx) => {
              const dc = DIFF_COLORS[lesson.diff];
              return (
                <button
                  key={lesson.slug}
                  onClick={() => navigate(`/lesson/${courseKey}/${lesson.slug}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-left transition cursor-pointer hover:bg-[var(--surface)] group"
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{
                      background: lesson.completed ? 'var(--success)' : dc.bg,
                      color: lesson.completed ? '#fff' : dc.text,
                    }}
                  >
                    {lesson.completed ? '✓' : idx + 1}
                  </span>
                  <span className="text-[14px] font-medium leading-tight group-hover:text-[var(--accent)] transition flex-1">
                    {lesson.displayName}
                  </span>
                  {lesson.hasTests && (
                    <span
                      className={`text-[10px] font-semibold tabular-nums flex items-center gap-0.5 ${lesson.completed ? 'text-[var(--success)]' : 'text-[var(--accent)]'}`}
                      title={t('common.xpReward', { xp: xpForLesson(lesson.sortOrder) })}
                    >
                      {t('common.xpReward', { xp: xpForLesson(lesson.sortOrder) })}
                    </span>
                  )}
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: dc.bg, color: dc.text }}
                  >
                    {t(`algoList.diff.${lesson.diff}`)}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </main>
    </div>
  );
}
