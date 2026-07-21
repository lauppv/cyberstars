import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '../hooks/useLesson';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useTerminalSession } from '../hooks/useTerminalSession';
import { useProgress } from '../hooks/useProgress';
import { useGamification } from '../hooks/useGamification';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useGuestSignupPrompt } from '../context/GuestSignupPromptContext';
import { xpForLesson } from '../../shared/constants';
import { Topbar } from '../components/layout/Topbar';
import { AchievementToast } from '../components/gamification/AchievementToast';
import { CodeEditor } from '../components/code/CodeEditor';
import { CodeOutput } from '../components/code/CodeOutput';
import { RunButton } from '../components/code/RunButton';
import { TestResults } from '../components/code/TestResults';
import { SolutionModal } from '../components/code/SolutionModal';
import { ShareToForumModal } from '../components/forum/ShareToForumModal';
import { TerminalPanel } from '../components/terminal/TerminalPanel';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ResizeHandle } from '../components/ui/ResizeHandle';
import { useResizeSplit } from '../hooks/useResizeSplit';
import type { LessonMeta } from '../../shared/lesson';
import type { RunTestsResponse } from '../../shared/tests';
import type { TerminalTestResult } from '../../shared/terminal';
import * as progressService from '../services/progressService';
import * as testsService from '../services/testsService';
import * as terminalService from '../services/terminalService';
import { courseMeta } from '../constants/courses';
import { TERMINAL_COURSE_KEYS, ALGO_COURSE_KEYS, MAIN_COURSE_KEYS } from '../../shared/constants';

function parseDifficulty(title: string): {
  difficulty: 'Easy' | 'Medium' | 'Hard' | null;
  rest: string;
} {
  const m = title.match(/^(Easy|Medium|Hard)\s*[·-]\s*(.+)$/i);
  if (!m) return { difficulty: null, rest: title };
  const d = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
  return { difficulty: d as 'Easy' | 'Medium' | 'Hard', rest: m[2] };
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'var(--success)',
  Medium: 'var(--warning)',
  Hard: 'var(--error)',
};

export function LessonPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { category = '', lesson = '' } = useParams<{ category: string; lesson: string }>();
  const { isLoggedIn } = useAuth();

  const isTerminal = (TERMINAL_COURSE_KEYS as readonly string[]).includes(category);
  const isAlgo = (ALGO_COURSE_KEYS as readonly string[]).includes(category);
  const isMainCourse = (MAIN_COURSE_KEYS as readonly string[]).includes(category);

  const { title, content, starterCode, savedCode, solution, isLoading } = useLesson(
    category,
    lesson,
  );
  const { notifyRunComplete } = useGuestSignupPrompt();
  const notifyGuestRun = useCallback(() => notifyRunComplete(0), [notifyRunComplete]);
  const { output, isRunning, execute, sendInput, clearOutput } =
    useCodeExecution(notifyRunComplete);
  const terminal = useTerminalSession(
    isTerminal ? category : '',
    isTerminal ? lesson : '',
    notifyGuestRun,
  );
  const { saveCode, progress, loadProgress } = useProgress(category);
  const gamification = useGamification();
  const { refresh: refreshGamification } = gamification;
  const { courses } = useCurriculum();

  const [userCode, setUserCode] = useState('');
  const [activeTab, setActiveTab] = useState<'lesson' | 'workspace'>('lesson');
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ icon: '✅', title: '' });
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [testResults, setTestResults] = useState<RunTestsResponse | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testsError, setTestsError] = useState<string | null>(null);
  const [terminalTestResult, setTerminalTestResult] = useState<TerminalTestResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [terminalTestsError, setTerminalTestsError] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const justMarkedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Draggable split only applies on the lg+ side-by-side layout; below that the
  // panels are tab-switched and take the full width.
  const [isLg, setIsLg] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsLg(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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
  const saveToastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const loadedLessonRef = useRef('');
  const loadedStarterRef = useRef('');

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const course = courses.find((c) => c.key === category) ?? null;

  const serverCompleted = progress?.lessons.find((l) => l.slug === lesson)?.completed ?? false;
  const lessonCompleted = optimisticCompleted ?? serverCompleted;

  // Populate the editor once a lesson's code is loaded. Opening a lesson loads
  // the user's saved code (or the starter). A language switch within the same
  // lesson re-translates the editor only while it still holds the untouched
  // starter — code the user has written or saved is preserved.
  useEffect(() => {
    if (isLoading) return;
    const lessonKey = `${category}/${lesson}`;
    if (loadedLessonRef.current !== lessonKey) {
      loadedLessonRef.current = lessonKey;
      loadedStarterRef.current = starterCode;
      setUserCode(savedCode ?? starterCode);
      return;
    }
    if (starterCode !== loadedStarterRef.current) {
      const prevStarter = loadedStarterRef.current;
      loadedStarterRef.current = starterCode;
      setUserCode((prev) => (prev === prevStarter ? starterCode : prev));
    }
  }, [isLoading, category, lesson, starterCode, savedCode]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    justMarkedRef.current = false;
    clearOutput();
    setTimeout(() => {
      setShowToast(false);
      setShowSolution(false);
      setOptimisticCompleted(null);
      setTestResults(null);
      setTestsError(null);
      setTerminalTestResult(null);
      setTerminalTestsError(null);
    }, 0);
  }, [lesson, clearOutput]);

  useEffect(() => {
    if (isLoggedIn && category && lesson) {
      progressService.trackAccess(category, lesson).catch(() => {});
    }
  }, [isLoggedIn, category, lesson]);

  useEffect(() => {
    if (lessonCompleted && justMarkedRef.current) {
      justMarkedRef.current = false;
      const meta = course?.lessons.find((l) => l.slug === lesson);
      const isLast = course && course.lessons[course.lessons.length - 1].slug === lesson;
      const base = isLast ? t('lesson.courseMilestone') : t('lesson.lessonComplete');
      const xpGain = meta ? t('lesson.xpGained', { xp: xpForLesson(meta.sortOrder) }) : '';
      setToastData({
        icon: isLast ? '🏆' : '✅',
        title: xpGain ? `${base} ${xpGain}` : base,
      });
      setShowToast(true);
    }
  }, [lessonCompleted, course, lesson, t]);

  const lessonList: LessonMeta[] = course?.lessons ?? [];
  const currentIndex = lessonList.findIndex((l) => l.slug === lesson);
  const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null;

  const hasTests = lessonList.find((l) => l.slug === lesson)?.hasTests ?? false;

  const handleRun = useCallback(() => {
    if (isRunning) return;
    setTestResults(null);
    setTestsError(null);
    execute(userCode, category);
  }, [isRunning, execute, userCode, category]);

  // Judge run: all test cases pass → the lesson marks itself complete (lessons
  // with tests have no manual Mark Complete). Guests see the verdict but have
  // no progress to persist.
  const handleRunTests = useCallback(async () => {
    if (isTesting || isRunning) return;
    setIsTesting(true);
    setTestsError(null);
    try {
      const lang = i18n.language === 'ro' ? 'ro' : 'en';
      const results = await testsService.runTests(category, lesson, userCode, lang);
      setTestResults(results);
      // The server marks the lesson complete on a passing verdict (see
      // tests.controller). Reflect it optimistically, then refresh from the DB.
      if (results.status === 'passed' && isLoggedIn) {
        // Persist the passing code so reopening the lesson (e.g. "Review")
        // shows the solved state instead of an empty editor. Stays until the
        // student resets or saves again manually.
        saveCode(lesson, userCode).catch(() => {});
        if (!lessonCompleted) {
          justMarkedRef.current = true;
          setOptimisticCompleted(true);
          loadProgress();
          refreshGamification();
        }
      }
    } catch (err) {
      setTestsError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsTesting(false);
    }
  }, [
    isTesting,
    isRunning,
    category,
    lesson,
    userCode,
    i18n,
    isLoggedIn,
    lessonCompleted,
    loadProgress,
    refreshGamification,
    saveCode,
  ]);

  // Terminal (Linux) judge: validates sandbox state against the live session
  // container (no code — the student's typed commands built the state). Same
  // server-authoritative completion as the code judge.
  const handleRunTerminalChecks = useCallback(async () => {
    if (isChecking || !terminal.sessionId) return;
    setIsChecking(true);
    setTerminalTestsError(null);
    try {
      const lang = i18n.language === 'ro' ? 'ro' : 'en';
      const results = await terminalService.checkTerminalTests(
        terminal.sessionId,
        category,
        lesson,
        lang,
      );
      setTerminalTestResult(results);
      if (results.status === 'passed' && isLoggedIn && !lessonCompleted) {
        justMarkedRef.current = true;
        setOptimisticCompleted(true);
        loadProgress();
        refreshGamification();
      }
    } catch (err) {
      setTerminalTestsError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsChecking(false);
    }
  }, [
    isChecking,
    terminal.sessionId,
    category,
    lesson,
    i18n,
    isLoggedIn,
    lessonCompleted,
    loadProgress,
    refreshGamification,
  ]);

  const handleSave = useCallback(async () => {
    if (isLoggedIn) {
      await saveCode(lesson, userCode);
      setShowSaveToast(true);
      if (saveToastTimer.current) clearTimeout(saveToastTimer.current);
      saveToastTimer.current = setTimeout(() => setShowSaveToast(false), 2000);
    }
  }, [isLoggedIn, saveCode, lesson, userCode]);

  useEffect(() => {
    return () => {
      if (saveToastTimer.current) clearTimeout(saveToastTimer.current);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-transparent text-[var(--text)]">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-transparent text-[var(--text)] overflow-hidden">
      <Topbar
        breadcrumb={{
          course: course?.title,
          lesson: title,
          courseHref: category.startsWith('algo-')
            ? `/algorithms/${category.replace('algo-', '')}`
            : '/courses',
        }}
      />

      {/* Mobile panel switcher (split-screen stays on lg+) */}
      <div className="lg:hidden flex border-b border-[var(--accent)]/20 bg-[rgba(22,22,29,0.5)] backdrop-blur-[12px]">
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 py-3 text-[13px] font-semibold transition cursor-pointer bg-transparent border-b-2 ${
            activeTab === 'lesson'
              ? 'text-[var(--accent)] border-[var(--accent)]'
              : 'text-[var(--text3)] border-transparent'
          }`}
        >
          {t('lesson.tabLesson')}
        </button>
        <button
          onClick={() => setActiveTab('workspace')}
          className={`flex-1 py-3 text-[13px] font-semibold transition cursor-pointer bg-transparent border-b-2 ${
            activeTab === 'workspace'
              ? 'text-[var(--accent)] border-[var(--accent)]'
              : 'text-[var(--text3)] border-transparent'
          }`}
        >
          {isTerminal ? t('lesson.tabTerminal') : t('lesson.tabCode')}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden justify-center">
        <div ref={bandRef} className="flex w-full lg:w-4/5 overflow-hidden">
          {/* Lesson content */}
          <div
            ref={contentRef}
            style={isLg ? { width: `${hSplit.size}%`, flex: '0 0 auto' } : undefined}
            className={`${activeTab === 'lesson' ? 'block' : 'hidden'} lg:block w-full overflow-y-auto bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px]`}
          >
            <div className="px-9 py-8">
              {(() => {
                const { rest } = parseDifficulty(title);
                const { difficulty } = parseDifficulty(lessonList[currentIndex]?.title ?? '');
                return (
                  <>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-[1px] bg-[var(--accent)]/15 text-[var(--accent)]">
                        {t(isAlgo ? 'lesson.algoNofM' : 'lesson.lessonNofM', {
                          n: currentIndex + 1,
                          total: lessonList.length,
                        })}
                      </span>
                      {lessonCompleted && (
                        <span className="text-[var(--success)] text-xs font-semibold flex items-center gap-1">
                          {t('lesson.completed')}
                        </span>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        {difficulty && (
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[1px]"
                            style={{
                              background: `color-mix(in srgb, ${DIFFICULTY_COLOR[difficulty]} 15%, transparent)`,
                              color: DIFFICULTY_COLOR[difficulty],
                            }}
                          >
                            {t(`lesson.difficulty.${difficulty}`)}
                          </span>
                        )}
                        {currentIndex >= 0 && (
                          <span
                            className={`text-[11px] font-semibold tabular-nums flex items-center gap-1 ${lessonCompleted ? 'text-[var(--success)]' : 'text-[var(--accent)]'}`}
                            title={t('common.xpReward', {
                              xp: xpForLesson(lessonList[currentIndex].sortOrder),
                            })}
                          >
                            ⭐{' '}
                            {t('common.xpReward', {
                              xp: xpForLesson(lessonList[currentIndex].sortOrder),
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-6 text-[var(--text)]">
                      {rest}
                    </h1>
                  </>
                );
              })()}

              <div className="lesson-body">
                <MarkdownRenderer content={content} />
              </div>

              <div
                className="flex gap-3 mt-10"
                style={{ paddingBottom: 'calc(1rem + var(--radio-clearance, 0px))' }}
              >
                <button
                  onClick={() => prevLesson && navigate(`/lesson/${category}/${prevLesson.slug}`)}
                  disabled={!prevLesson}
                  className="px-5 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {t('lesson.previous')}
                </button>
                <button
                  onClick={() => nextLesson && navigate(`/lesson/${category}/${nextLesson.slug}`)}
                  disabled={!nextLesson}
                  className="px-5 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {t('lesson.next')}
                </button>
              </div>
            </div>
          </div>

          {isLg && (
            <ResizeHandle
              axis="x"
              onPointerDown={hSplit.onPointerDown}
              dragging={hSplit.dragging}
            />
          )}

          {/* Right panel: terminal or editor */}
          {isTerminal ? (
            <div
              className={`${activeTab === 'workspace' ? 'flex' : 'hidden'} lg:flex flex-1 min-w-0 flex-col bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] overflow-hidden`}
            >
              <TerminalPanel
                lines={terminal.lines}
                cwd={terminal.cwd}
                isReady={terminal.isReady}
                isExecuting={terminal.isExecuting}
                onExecute={terminal.execute}
                onReset={() => {
                  setTerminalTestResult(null);
                  setTerminalTestsError(null);
                  terminal.reset();
                }}
                lessonCompleted={lessonCompleted}
                hasSolution={!!solution}
                onShowSolution={() => setShowSolution(true)}
                hasTests={hasTests}
                isChecking={isChecking}
                onRunTests={handleRunTerminalChecks}
                testResult={terminalTestResult}
                onCloseTests={() => setTerminalTestResult(null)}
                testsError={terminalTestsError}
              />
            </div>
          ) : (
            <div
              className={`${activeTab === 'workspace' ? 'flex' : 'hidden'} lg:flex flex-1 min-w-0 flex-col bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] overflow-hidden`}
            >
              <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(30,30,40,0.3)] border-b border-[var(--accent)]/20">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text2)]">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: courseMeta(category).color }}
                  />
                  {courseMeta(category).langLabel}
                </div>
                <div className="flex items-center gap-2">
                  {showSaveToast && (
                    <span className="text-[var(--success)] text-[12px] font-semibold animate-pulse">
                      {t('lesson.codeSaved')}
                    </span>
                  )}
                  {lessonCompleted && (
                    <span className="text-[12px] font-semibold text-[var(--success)]">
                      {t('lesson.completed')}
                    </span>
                  )}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen((v) => !v)}
                      aria-haspopup="menu"
                      aria-expanded={menuOpen}
                      aria-label={t('lesson.actions')}
                      className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border border-[var(--accent)]/30"
                    >
                      <span className="text-[16px] leading-none">⋯</span>
                    </button>
                    {menuOpen && (
                      <div
                        role="menu"
                        className="absolute right-0 mt-2 w-52 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] shadow-[0_8px_32px_#0008] overflow-hidden z-50 fade-in-up"
                      >
                        {solution && (
                          <button
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              setShowSolution(true);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border-none"
                          >
                            {t('lesson.showSolution')}
                          </button>
                        )}
                        {isLoggedIn && (
                          <button
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              handleSave();
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border-none"
                          >
                            {t('lesson.save')}
                          </button>
                        )}
                        {isLoggedIn && userCode.trim().length > 0 && (
                          <button
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              setShowShareModal(true);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border-none"
                          >
                            {t('lesson.shareToForum')}
                          </button>
                        )}
                        <button
                          role="menuitem"
                          onClick={() => {
                            setMenuOpen(false);
                            if (window.confirm(t('lesson.confirmReset'))) setUserCode(starterCode);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border-none"
                        >
                          {t('lesson.reset')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div ref={workspaceRef} className="flex-1 min-h-0 flex flex-col">
                <div
                  className="shrink-0 overflow-auto bg-[rgba(13,17,23,0.3)]"
                  style={isLg ? { height: `${vSplit.size}%` } : { maxHeight: '60%' }}
                >
                  <CodeEditor
                    value={userCode}
                    onChange={setUserCode}
                    language={category}
                    fontSize="16px"
                    onRun={handleRun}
                  />
                </div>

                {isLg && (
                  <ResizeHandle
                    axis="y"
                    onPointerDown={vSplit.onPointerDown}
                    dragging={vSplit.dragging}
                  />
                )}

                <div className="flex-1 min-h-0 p-3 border-t border-[var(--accent)]/20 bg-[rgba(22,22,29,0.15)] flex flex-col">
                  <div className="flex gap-2 mb-3 items-center flex-wrap">
                    <RunButton onClick={handleRun} isRunning={isRunning} />
                    {hasTests ? (
                      <button
                        onClick={handleRunTests}
                        disabled={isTesting || isRunning}
                        className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold text-[13px] flex items-center gap-1.5 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        {isTesting ? (
                          <>
                            <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t('tests.running')}
                          </>
                        ) : (
                          <>{t('tests.run')}</>
                        )}
                      </button>
                    ) : (
                      isMainCourse && (
                        <span title={t('tests.comingSoon')} className="inline-flex">
                          <button
                            disabled
                            className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold text-[13px] flex items-center gap-1.5 opacity-60 cursor-not-allowed"
                          >
                            {t('tests.run')}
                          </button>
                        </span>
                      )
                    )}
                    {testsError && (
                      <span className="text-[var(--error)] text-[12px] font-semibold">
                        {testsError}
                      </span>
                    )}
                  </div>

                  {testResults ? (
                    <TestResults results={testResults} onClose={() => setTestResults(null)} />
                  ) : (
                    <CodeOutput
                      output={output}
                      isRunning={isRunning}
                      onInput={sendInput}
                      fillHeight
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AchievementToast
        icon={toastData.icon}
        title={toastData.title}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
      <AchievementToast
        icon={gamification.newBadge?.icon ?? '🏅'}
        title={t('lesson.badgeEarned', { label: gamification.newBadge?.label ?? '' })}
        visible={!!gamification.newBadge}
        onClose={gamification.dismissNewBadge}
      />
      {showSolution && solution && (
        <SolutionModal
          solution={solution}
          currentCode={isTerminal ? undefined : userCode}
          language={category}
          onClose={() => setShowSolution(false)}
        />
      )}
      {showShareModal && (
        <ShareToForumModal
          code={userCode}
          language={category}
          lessonTitle={title}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
