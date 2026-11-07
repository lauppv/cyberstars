import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';
import { BetaBadge } from '../components/ui/BetaBadge';
import { CourseMark } from '../components/ui/CourseMark';
import { LoadError } from '../components/ui/LoadError';
import { DifficultyFilters } from '../components/ui/DifficultyFilters';
import { DIFF_COLORS, type DifficultyFilter } from '../constants/difficulty';
import { courseLabel, courseMeta, courseWash } from '../constants/courses';
import { useAuth } from '../context/AuthContext';
import { progressPct } from '@cyberstars/shared/constants';
import { canAccessFeature } from '@cyberstars/shared/features';
import { PROJECTS, PROJECT_LANGUAGES, type ProjectCheckDTO } from '@cyberstars/shared/projects';
import * as projectsService from '../services/projectsService';
import { NotFoundPage } from './NotFoundPage';

// A language's projects as a list, laid out like a challenge list: the
// difficulty filters on top, each project with how many of its steps are ticked
export function ProjectListPage() {
  const { language = '' } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [filter, setFilter] = useState<DifficultyFilter>('all');
  const [checks, setChecks] = useState<ProjectCheckDTO[] | null>(null);
  const [failed, setFailed] = useState(false);
  const allowed = canAccessFeature('projects', user?.role, import.meta.env.PROD);
  const known = (PROJECT_LANGUAGES as readonly string[]).includes(language);

  const fetchChecks = useCallback(() => {
    projectsService
      .getChecks()
      .then(setChecks)
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    if (user && allowed && known) fetchChecks();
  }, [user, allowed, known, fetchChecks]);

  const retry = () => {
    setFailed(false);
    fetchChecks();
  };

  const projects = useMemo(() => {
    const ticked = new Map<string, number>();
    for (const c of checks ?? []) {
      if (c.language === language) ticked.set(c.slug, (ticked.get(c.slug) ?? 0) + 1);
    }
    return PROJECTS.filter((p) => p.language === language).map((p) => {
      const done = ticked.get(p.slug) ?? 0;
      return { ...p, done, finished: done === p.steps.length };
    });
  }, [checks, language]);

  if (!allowed || !known) return <NotFoundPage />;

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.difficulty === filter);
  const finished = projects.filter((p) => p.finished).length;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div
          className="panel rounded-[14px] overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          <div
            className="px-6 pt-6 pb-4 border-b border-[var(--border)]"
            style={{ backgroundImage: courseWash(language) }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CourseMark courseKey={language} size={40} />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold flex items-center gap-2">
                  {t('projects.setTitle', { language: courseLabel(language, t) })}
                  <BetaBadge hint={t('projects.betaHint')} />
                </h1>
                <p className="text-[var(--text3)] text-xs">
                  {t('projects.count', { count: projects.length })}
                </p>
              </div>
            </div>

            {user && checks && projects.length > 0 && (
              <div className="mb-4">
                <div className="text-[11px] text-[var(--text3)] mb-1">
                  {t('projects.finished', { done: finished, total: projects.length })}
                </div>
                <div className="h-1 bg-[var(--bg3)] rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-[width] duration-400"
                    style={{
                      width: `${progressPct(finished, projects.length)}%`,
                      background: courseMeta(language).color,
                    }}
                  />
                </div>
              </div>
            )}

            <DifficultyFilters value={filter} onChange={setFilter} />
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
            {failed && (
              <div className="mb-2">
                <LoadError text={t('projects.checksFailed')} onRetry={retry} />
              </div>
            )}
            {filtered.length === 0 && (
              <p className="text-center text-[var(--text3)] text-sm py-6">
                {t(projects.length === 0 ? 'projects.noneYet' : 'projects.noMatch')}
              </p>
            )}
            {filtered.map((project) => {
              const dc = DIFF_COLORS[project.difficulty];
              return (
                <button
                  key={project.slug}
                  onClick={() => navigate(`/projects/${language}/${project.slug}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-left transition cursor-pointer hover:bg-[var(--surface)] group"
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{
                      background: project.finished ? 'var(--success)' : dc.bg,
                      color: project.finished ? '#fff' : dc.text,
                    }}
                  >
                    {project.finished ? '✓' : projects.indexOf(project) + 1}
                  </span>
                  <span className="text-[14px] font-medium leading-tight group-hover:text-[var(--accent)] transition flex-1">
                    {project.title}
                  </span>
                  {user && checks && (
                    <span
                      className={`text-[10px] font-semibold tabular-nums ${project.finished ? 'text-[var(--success)]' : 'text-[var(--text3)]'}`}
                    >
                      {t('projects.stepsDone', { done: project.done, total: project.steps.length })}
                    </span>
                  )}
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: dc.bg, color: dc.text }}
                  >
                    {t(`algoList.diff.${project.difficulty}`)}
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
