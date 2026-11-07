import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Topbar } from '../components/layout/Topbar';
import { BetaBadge } from '../components/ui/BetaBadge';
import { LoadError } from '../components/ui/LoadError';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ResizeHandle } from '../components/ui/ResizeHandle';
import { DIFF_COLORS } from '../constants/difficulty';
import { PanelTabs } from '../components/judge/PanelTabs';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { CodeEditor } from '../components/code/CodeEditor';
import { CodeOutput } from '../components/code/CodeOutput';
import { RunButton } from '../components/code/RunButton';
import { TerminalPanel } from '../components/terminal/TerminalPanel';
import { useAuth } from '../context/AuthContext';
import { useGuestSignupPrompt } from '../context/GuestSignupPromptContext';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useResizeSplit } from '../hooks/useResizeSplit';
import { useTerminalSession } from '../hooks/useTerminalSession';
import { courseLabel, courseMeta } from '../constants/courses';
import { canAccessFeature } from '@cyberstars/shared/features';
import { PROJECTS, findProject, splitProjectText, type Project } from '@cyberstars/shared/projects';
import * as projectsService from '../services/projectsService';
import { NotFoundPage } from './NotFoundPage';

// The project's code stays on this device for now, one file per project
function codeKey(project: Project): string {
  return `cyberstars.project.${project.language}.${project.slug}`;
}

function readCode(project: Project): string {
  try {
    return localStorage.getItem(codeKey(project)) ?? '';
  } catch {
    return '';
  }
}

function writeCode(project: Project, code: string) {
  try {
    localStorage.setItem(codeKey(project), code);
  } catch {
    // storage blocked: the code lasts for this visit
  }
}

// The project's requirements, each with a box the student ticks once their
// program does it; the ticks are kept on the account
function Steps({ project, sections }: { project: Project; sections: { body: string }[] }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [checked, setChecked] = useState<Set<string> | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [saveFailed, setSaveFailed] = useState(false);
  // A guest gets the first step open; a student, the first one still to do
  const [open, setOpen] = useState<Set<string>>(() =>
    user ? new Set() : new Set([project.steps[0].id]),
  );
  const openedFirst = useRef(false);

  const fetchChecks = useCallback(() => {
    projectsService
      .getChecks()
      .then((all) => {
        const mine = new Set(
          all
            .filter((c) => c.language === project.language && c.slug === project.slug)
            .map((c) => c.stepId),
        );
        setChecked(mine);
        // The first step still to do opens, so the student lands on it
        if (!openedFirst.current) {
          openedFirst.current = true;
          const next = project.steps.find((s) => !mine.has(s.id));
          if (next) setOpen(new Set([next.id]));
        }
      })
      .catch(() => setLoadFailed(true));
  }, [project]);

  useEffect(() => {
    if (user) fetchChecks();
  }, [user, fetchChecks]);

  const retry = () => {
    setLoadFailed(false);
    fetchChecks();
  };

  const toggleOpen = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Ticked at once on screen, put back if the server didn't keep it
  const toggleCheck = (id: string) => {
    if (!user || !checked || saving.has(id)) return;
    const value = !checked.has(id);
    const flip = (set: Set<string>, on: boolean) => {
      const next = new Set(set);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    };
    setSaveFailed(false);
    setChecked((prev) => prev && flip(prev, value));
    setSaving((prev) => flip(prev, true));
    projectsService
      .setCheck(project.language, project.slug, id, value)
      .catch(() => {
        setChecked((prev) => prev && flip(prev, !value));
        setSaveFailed(true);
      })
      .finally(() => setSaving((prev) => flip(prev, false)));
  };

  const done = checked ? project.steps.filter((s) => checked.has(s.id)).length : 0;
  const total = project.steps.length;
  const { color } = courseMeta(project.language);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="m-0 text-[16px] font-bold">{t('projects.steps')}</h2>
        {user && checked && (
          <span className="text-[11px] text-[var(--text3)]">
            {t('projects.stepsDone', { done, total })}
          </span>
        )}
      </div>
      {user && checked && (
        <div className="h-1 bg-[var(--bg3)] rounded-sm overflow-hidden mb-3">
          <div
            className="h-full rounded-sm transition-[width] duration-400"
            style={{ width: `${(done / total) * 100}%`, background: color }}
          />
        </div>
      )}
      {!user && (
        <p className="mt-0 mb-3 text-[12px] text-[var(--text3)]">{t('projects.signInToTrack')}</p>
      )}
      {loadFailed && (
        <div className="mb-3">
          <LoadError text={t('projects.checksFailed')} onRetry={retry} />
        </div>
      )}
      {saveFailed && (
        <p role="alert" className="mt-0 mb-3 text-[12px] font-semibold text-[var(--error)]">
          {t('projects.saveFailed')}
        </p>
      )}

      <ol className="m-0 p-0 list-none flex flex-col">
        {project.steps.map((step, i) => {
          const isChecked = checked?.has(step.id) ?? false;
          const isOpen = open.has(step.id);
          const canTick = !!user && !!checked && !saving.has(step.id);
          return (
            <li key={step.id} className="border-b border-[var(--border)] last:border-b-0">
              <div className="flex items-center gap-3 px-1 py-2.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  aria-label={t('projects.markStep', { title: step.title })}
                  disabled={!canTick}
                  onClick={() => toggleCheck(step.id)}
                  className={`shrink-0 w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition cursor-pointer disabled:cursor-not-allowed ${
                    isChecked
                      ? 'bg-[var(--success)] border-[var(--success)] text-white'
                      : 'bg-transparent border-[var(--text3)] hover:border-[var(--accent)]'
                  } ${user && checked ? '' : 'opacity-50'}`}
                >
                  {isChecked && <Check size={12} strokeWidth={3} />}
                </button>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleOpen(step.id)}
                  className="flex-1 min-w-0 flex items-center gap-2 text-left bg-transparent border-none p-0 cursor-pointer text-[var(--text)] group"
                >
                  <span className="flex-1 min-w-0 text-[14px] font-medium leading-tight group-hover:text-[var(--accent)] transition">
                    {i + 1}. {step.title}
                  </span>
                  {isOpen ? (
                    <ChevronDown size={16} className="text-[var(--text3)]" />
                  ) : (
                    <ChevronRight size={16} className="text-[var(--text3)]" />
                  )}
                </button>
              </div>
              {isOpen && (
                <div className="lesson-body pl-[30px] pb-4">
                  <MarkdownRenderer content={sections[i]?.body ?? ''} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// Laid out like a lesson: the project on the left, the code on the right
export function ProjectPage() {
  const { user } = useAuth();
  const { language = '', slug = '' } = useParams();
  const project = findProject(language, slug);
  if (!canAccessFeature('projects', user?.role, import.meta.env.PROD) || !project) {
    return <NotFoundPage />;
  }
  // Another project starts with its own text, code and tabs
  return <ProjectView key={`${project.language}/${project.slug}`} project={project} />;
}

function ProjectView({ project }: { project: Project }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [activeTab, setActiveTab] = useState<'project' | 'workspace'>('project');
  const [code, setCode] = useState(() => readCode(project));
  const { notifyRunComplete } = useGuestSignupPrompt();
  const { output, isRunning, execute, stop, sendInput } = useCodeExecution(notifyRunComplete);
  const bandRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const hSplit = useResizeSplit({
    axis: 'x',
    initial: 50,
    min: 28,
    max: 68,
    containerRef: bandRef,
  });
  const vSplit = useResizeSplit({
    axis: 'y',
    initial: 60,
    min: 25,
    max: 80,
    containerRef: workspaceRef,
  });

  const fetchText = useCallback(() => {
    projectsService
      .getProjectText(project.language, project.slug)
      .then(setText)
      .catch(() => setFailed(true));
  }, [project]);

  useEffect(fetchText, [fetchText]);

  const retry = () => {
    setFailed(false);
    fetchText();
  };

  const siblings = PROJECTS.filter((p) => p.language === project.language);
  const index = siblings.indexOf(project);
  const prev = siblings[index - 1];
  const next = siblings[index + 1];
  const dc = DIFF_COLORS[project.difficulty];
  const meta = courseMeta(project.language);
  const sections = text === null ? null : splitProjectText(text);

  const changeCode = (value: string) => {
    setCode(value);
    writeCode(project, value);
  };
  const run = () => execute(code, project.language);

  return (
    <div className="h-screen bg-transparent flex flex-col text-[var(--text)] overflow-hidden">
      <Topbar
        breadcrumb={{
          course: t('projects.setTitle', { language: courseLabel(project.language, t) }),
          lesson: project.title,
          courseHref: `/projects/${project.language}`,
        }}
      />

      <PanelTabs
        className="@2xl:hidden bg-[var(--glass)]"
        fill
        tabs={[
          { key: 'project' as const, label: t('projects.tabProject') },
          { key: 'workspace' as const, label: t('lesson.tabCode') },
        ]}
        active={activeTab}
        onSelect={setActiveTab}
      />

      <div className="flex flex-1 overflow-hidden justify-center">
        <div ref={bandRef} className="flex w-full @5xl:w-4/5 overflow-hidden">
          <div
            style={{ '--split': `${hSplit.size}%` } as CSSProperties}
            className={`${activeTab === 'project' ? 'flex' : 'hidden'} @2xl:flex w-full @2xl:w-[var(--split)] @2xl:flex-none min-w-0 flex-col bg-[var(--panel-bg)]`}
          >
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="px-9 py-8">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-[1px] bg-[var(--accent)]/15 text-[var(--accent)]">
                    {t('projects.nOfM', { n: index + 1, total: siblings.length })}
                  </span>
                  <BetaBadge hint={t('projects.betaHint')} />
                  <div className="ml-auto flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[1px]"
                      style={{ background: dc.bg, color: dc.text }}
                    >
                      {t(`algoList.filters.${project.difficulty}`)}
                    </span>
                  </div>
                </div>

                <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-6 text-[var(--text)]">
                  {project.title}
                </h1>

                {failed ? (
                  <LoadError text={t('projects.textFailed')} onRetry={retry} />
                ) : sections === null ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <div className="lesson-body">
                      <MarkdownRenderer content={sections.intro} />
                    </div>
                    <Steps project={project} sections={sections.steps} />
                  </>
                )}

                <div className="flex gap-3 mt-10 pb-4">
                  <button
                    onClick={() => prev && navigate(`/projects/${prev.language}/${prev.slug}`)}
                    disabled={!prev}
                    className="px-5 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    {t('projects.previous')}
                  </button>
                  <button
                    onClick={() => next && navigate(`/projects/${next.language}/${next.slug}`)}
                    disabled={!next}
                    className="px-5 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    {t('projects.next')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ResizeHandle
            axis="x"
            className="hidden @2xl:block"
            onPointerDown={hSplit.onPointerDown}
            dragging={hSplit.dragging}
          />

          <div
            className={`${activeTab === 'workspace' ? 'flex' : 'hidden'} @2xl:flex flex-1 min-w-0 flex-col bg-[var(--panel-bg)] overflow-hidden`}
          >
            {project.language === 'linux' ? (
              <ProjectTerminal slug={project.slug} onCommandRun={notifyRunComplete} />
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(30,30,40,0.3)] border-b border-[var(--border)]">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text2)]">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: meta.color }}
                    />
                    {meta.langLabel}
                  </div>
                </div>
                <div ref={workspaceRef} className="flex-1 min-h-0 flex flex-col">
                  <div
                    className="shrink-0 overflow-auto bg-[rgba(13,17,23,0.3)] max-h-[60%] @2xl:max-h-none @2xl:h-[var(--vsplit)]"
                    style={{ '--vsplit': `${vSplit.size}%` } as CSSProperties}
                  >
                    <CodeEditor
                      value={code}
                      onChange={changeCode}
                      language={project.language}
                      fontSize="16px"
                      onRun={run}
                    />
                  </div>
                  <ResizeHandle
                    axis="y"
                    className="hidden @2xl:block"
                    onPointerDown={vSplit.onPointerDown}
                    dragging={vSplit.dragging}
                  />
                  <div className="flex-1 min-h-0 p-3 border-t border-[var(--border)] bg-[var(--glass)] flex flex-col">
                    <div className="flex gap-2 mb-3 items-center flex-wrap">
                      <RunButton onClick={run} isRunning={isRunning} onStop={stop} />
                    </div>
                    <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                      <CodeOutput
                        output={output}
                        isRunning={isRunning}
                        onInput={sendInput}
                        fillHeight
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// A Linux project's sandbox, started with the project's files; Reset starts
// it over, since nothing in it is kept
function ProjectTerminal({
  slug,
  onCommandRun,
}: {
  slug: string;
  onCommandRun: (exitCode: number | undefined) => void;
}) {
  // A command counts for the guest's sign-up nudge like a lesson's, as one that went well
  const commandRun = useCallback(() => onCommandRun(0), [onCommandRun]);
  const terminal = useTerminalSession('linux', slug, commandRun, 'project');
  return (
    <TerminalPanel
      lines={terminal.lines}
      cwd={terminal.cwd}
      isReady={terminal.isReady}
      isExecuting={terminal.isExecuting}
      onExecute={terminal.execute}
      onReset={terminal.reset}
    />
  );
}
