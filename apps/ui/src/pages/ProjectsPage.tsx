import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FolderOpen, SearchX } from 'lucide-react';
import { Topbar } from '../components/layout/Topbar';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/layout/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { SetCard } from '../components/sets/SetCard';
import { SetDrawer } from '../components/sets/SetDrawer';
import { SetGrid } from '../components/sets/SetGrid';
import { SetRow } from '../components/sets/SetRow';
import { DifficultyFilters } from '../components/ui/DifficultyFilters';
import { LoadError } from '../components/ui/LoadError';
import { type DifficultyFilter } from '../constants/difficulty';
import { courseLabel } from '../constants/courses';
import { useAuth } from '../context/AuthContext';
import { progressPct } from '@cyberstars/shared/constants';
import { canAccessFeature } from '@cyberstars/shared/features';
import {
  PROJECTS,
  PROJECT_LANGUAGES,
  type Project,
  type ProjectCheckDTO,
} from '@cyberstars/shared/projects';
import * as projectsService from '../services/projectsService';
import { NotFoundPage } from './NotFoundPage';

interface LanguageProjects {
  language: string;
  projects: (Project & { number: number; done: number; finished: boolean })[];
  finished: number;
  ticked: number;
}

// A card per language, as Algorithms has one per challenge set;
// /projects/:language opens that language's projects in the drawer over them
export function ProjectsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language } = useParams<{ language?: string }>();
  const [checks, setChecks] = useState<ProjectCheckDTO[] | null>(null);
  const [failed, setFailed] = useState(false);
  const allowed = canAccessFeature('projects', user?.role, import.meta.env.PROD);

  const fetchChecks = useCallback(() => {
    projectsService
      .getChecks()
      .then(setChecks)
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    if (user && allowed) fetchChecks();
  }, [user, allowed, fetchChecks]);

  const retry = () => {
    setFailed(false);
    fetchChecks();
  };
  const close = useCallback(() => navigate('/projects'), [navigate]);

  const byLanguage: LanguageProjects[] = useMemo(
    () =>
      PROJECT_LANGUAGES.map((lang) => {
        const ticks = new Map<string, number>();
        for (const c of checks ?? []) {
          if (c.language === lang) ticks.set(c.slug, (ticks.get(c.slug) ?? 0) + 1);
        }
        const projects = PROJECTS.filter((p) => p.language === lang).map((p, i) => {
          const done = ticks.get(p.slug) ?? 0;
          return { ...p, number: i + 1, done, finished: done === p.steps.length };
        });
        return {
          language: lang,
          projects,
          finished: projects.filter((p) => p.finished).length,
          ticked: projects.reduce((n, p) => n + p.done, 0),
        };
      }),
    [checks],
  );

  if (!allowed) return <NotFoundPage />;

  const open = language ? byLanguage.find((l) => l.language === language) : undefined;

  const tracked = !!user && !!checks;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <PageContainer>
        {failed && !open && (
          <div className="mb-4">
            <LoadError text={t('projects.checksFailed')} onRetry={retry} />
          </div>
        )}
        <PageHeader title={t('nav.projects')} subtitle={t('projects.subtitle')} />
        <SetGrid>
          {byLanguage.map((l) => {
            const count = l.projects.length;
            // The one to go on with: a project started and not finished, else
            // the first not finished
            const next =
              l.projects.find((p) => p.done > 0 && !p.finished) ??
              l.projects.find((p) => !p.finished);
            return (
              <SetCard
                key={l.language}
                setKey={l.language}
                title={courseLabel(l.language, t)}
                beta
                betaHint={t('projects.betaHint')}
                description={t(`projects.desc.${l.language}`)}
                count={t('projects.count', { count })}
                progress={
                  tracked && l.ticked > 0
                    ? {
                        pct: progressPct(l.finished, count),
                        label: t('projects.finished', { done: l.finished, total: count }),
                      }
                    : undefined
                }
                onContinue={() => next && navigate(`/projects/${l.language}/${next.slug}`)}
                onOpen={() => navigate(`/projects/${l.language}`)}
                openLabel={t('projects.viewProjects')}
              />
            );
          })}
        </SetGrid>
      </PageContainer>

      {open && (
        <ProjectDrawer
          key={open.language}
          set={open}
          tracked={tracked}
          failed={failed}
          onRetry={retry}
          onClose={close}
        />
      )}
    </div>
  );
}

// A language's projects with the difficulty filters over them, each with how
// many of its steps are ticked
function ProjectDrawer({
  set,
  tracked,
  failed,
  onRetry,
  onClose,
}: {
  set: LanguageProjects;
  tracked: boolean;
  failed: boolean;
  onRetry: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<DifficultyFilter>('all');
  const { language, projects, finished } = set;
  const shown = filter === 'all' ? projects : projects.filter((p) => p.difficulty === filter);
  const count = projects.length;

  return (
    <SetDrawer
      setKey={language}
      title={t('projects.setTitle', { language: courseLabel(language, t) })}
      beta
      betaHint={t('projects.betaHint')}
      meta={[{ text: t('projects.count', { count }) }]}
      description={t(`projects.desc.${language}`)}
      progress={
        tracked && set.ticked > 0
          ? {
              pct: progressPct(finished, count),
              label: t('projects.finished', { done: finished, total: count }),
            }
          : undefined
      }
      label={t('nav.projects')}
      toolbar={count > 0 ? <DifficultyFilters value={filter} onChange={setFilter} /> : undefined}
      onClose={onClose}
    >
      {failed && (
        <div className="mb-2">
          <LoadError text={t('projects.checksFailed')} onRetry={onRetry} />
        </div>
      )}
      {shown.length === 0 ? (
        <EmptyState
          icon={count === 0 ? FolderOpen : SearchX}
          title={t(count === 0 ? 'projects.noneYet' : 'projects.noMatch')}
        />
      ) : (
        <div className="flex flex-col gap-0.5 pl-1">
          {shown.map((p, i) => (
            <SetRow
              key={p.slug}
              to={`/projects/${language}/${p.slug}`}
              number={p.number}
              title={p.title}
              done={p.finished}
              difficulty={p.difficulty}
              trailing={
                tracked ? t('projects.stepsDone', { done: p.done, total: p.steps.length }) : null
              }
              order={i}
            />
          ))}
        </div>
      )}
    </SetDrawer>
  );
}
