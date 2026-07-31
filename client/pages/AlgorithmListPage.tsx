import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';

import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { courseMeta } from '../constants/courses';
import { xpForLesson } from '../../shared/constants';

const DIFF_FILTERS = ['all', 'easy', 'medium', 'hard'] as const;

const DIFF_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  easy: { bg: 'rgba(0,214,143,0.12)', border: 'rgba(0,214,143,0.5)', text: 'var(--success)' },
  medium: { bg: 'rgba(255,170,0,0.12)', border: 'rgba(255,170,0,0.5)', text: 'var(--warning)' },
  hard: { bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.5)', text: 'var(--error)' },
};

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
  const [filter, setFilter] = useState<string>('all');

  const courseKey = `algo-${lang}`;
  const course = courses.find((c) => c.key === courseKey) ?? null;
  const progress = progressMap[courseKey] ?? null;
  const meta = courseMeta(lang);

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

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <div
          className="panel rounded-[14px] overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-[10px] flex items-center justify-center text-2xl"
                style={{ background: meta.color + '20' }}
              >
                {meta.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold">{t('algoList.title', { lang: meta.label })}</h1>
                <p className="text-[var(--text3)] text-xs">
                  {t('algoList.challenges', { count: lessons.length })}
                </p>
              </div>
            </div>

            {/* Difficulty filters */}
            <div className="flex gap-1.5">
              {DIFF_FILTERS.map((d) => {
                const isActive = filter === d;
                const dc = d !== 'all' ? DIFF_COLORS[d] : null;
                const style = dc
                  ? isActive
                    ? {
                        background: dc.bg,
                        color: dc.text,
                        border: `1px solid ${dc.text}`,
                        boxShadow: `0 0 10px ${dc.bg}`,
                      }
                    : {
                        background: 'transparent',
                        color: dc.text,
                        border: `1px solid ${dc.border}`,
                      }
                  : {
                      background: isActive ? 'var(--surface2)' : 'var(--bg3)',
                      color: isActive ? 'var(--text)' : 'var(--text3)',
                      border: '1px solid transparent',
                    };
                return (
                  <button
                    key={d}
                    onClick={() => setFilter(d)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-all"
                    style={style}
                  >
                    {t(`algoList.filters.${d}`)}
                  </button>
                );
              })}
            </div>
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
                      ⭐ {t('common.xpReward', { xp: xpForLesson(lesson.sortOrder) })}
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
