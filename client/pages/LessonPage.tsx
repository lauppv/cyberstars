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
import { Topbar } from '../components/layout/Topbar';
import { AchievementToast } from '../components/gamification/AchievementToast';
import { CodeEditor } from '../components/code/CodeEditor';
import { CodeOutput } from '../components/code/CodeOutput';
import { RunButton } from '../components/code/RunButton';
import { SolutionModal } from '../components/code/SolutionModal';
import { ShareToForumModal } from '../components/forum/ShareToForumModal';
import { TerminalPanel } from '../components/terminal/TerminalPanel';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { LessonMeta } from '../../shared/lesson';
import * as progressService from '../services/progressService';
import { courseMeta } from '../constants/courses';
import { TERMINAL_COURSE_KEYS, ALGO_COURSE_KEYS } from '../../shared/constants';

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { category = '', lesson = '' } = useParams<{ category: string; lesson: string }>();
  const { isLoggedIn } = useAuth();

  const isTerminal = (TERMINAL_COURSE_KEYS as readonly string[]).includes(category);
  const isAlgo = (ALGO_COURSE_KEYS as readonly string[]).includes(category);

  const { title, content, starterCode, savedCode, solution, isLoading } = useLesson(
    category,
    lesson,
  );
  const { output, isRunning, execute, sendInput, clearOutput } = useCodeExecution();
  const terminal = useTerminalSession(isTerminal ? category : '', isTerminal ? lesson : '');
  const { saveCode, progress, loadProgress } = useProgress(category);
  const gamification = useGamification();
  const { refresh: refreshGamification } = gamification;
  const { courses } = useCurriculum();

  const [userCode, setUserCode] = useState('');
  const [activeTab, setActiveTab] = useState<'lesson' | 'workspace'>('lesson');
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ icon: '✅', title: '' });
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const justMarkedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveToastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const loadedLessonRef = useRef('');
  const loadedStarterRef = useRef('');
  const completeFlushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCompleteRef = useRef<{
    desired: boolean;
    startingServer: boolean;
    courseKey: string;
    lessonSlug: string;
  } | null>(null);

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
      const isLast = course && course.lessons[course.lessons.length - 1].slug === lesson;
      setToastData({
        icon: isLast ? '🏆' : '✅',
        title: isLast ? t('lesson.courseMilestone') : t('lesson.lessonComplete'),
      });
      setShowToast(true);
    }
  }, [lessonCompleted, course, lesson, t]);

  const lessonList: LessonMeta[] = course?.lessons ?? [];
  const currentIndex = lessonList.findIndex((l) => l.slug === lesson);
  const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null;

  const handleRun = useCallback(() => {
    if (isRunning) return;
    execute(userCode, category);
  }, [isRunning, execute, userCode, category]);

  // Push the pending desired completion state to the server. Called by the 5s
  // debounce timer or eagerly when the user leaves the lesson. Skips the round
  // trip when the desired state matches what the server had at the start of the
  // debounce window (net-zero toggle: user clicked an even number of times).
  const flushToggleComplete = useCallback(async () => {
    if (completeFlushTimerRef.current) {
      clearTimeout(completeFlushTimerRef.current);
      completeFlushTimerRef.current = null;
    }
    const pending = pendingCompleteRef.current;
    pendingCompleteRef.current = null;
    if (!pending) return;
    if (pending.desired === pending.startingServer) return;
    setIsMarking(true);
    try {
      if (pending.desired) {
        await progressService.markLessonComplete(pending.courseKey, pending.lessonSlug);
      } else {
        await progressService.markLessonIncomplete(pending.courseKey, pending.lessonSlug);
      }
      loadProgress();
      refreshGamification();
    } finally {
      setIsMarking(false);
    }
  }, [loadProgress, refreshGamification]);

  const handleToggleComplete = useCallback(() => {
    if (!isLoggedIn) return;
    const next = !lessonCompleted;
    setOptimisticCompleted(next);
    // First click in a window seeds startingServer with the current server
    // value; subsequent clicks keep the same anchor so a net-zero toggle skips
    // the API call.
    const existing = pendingCompleteRef.current;
    pendingCompleteRef.current = {
      desired: next,
      startingServer: existing?.startingServer ?? serverCompleted,
      courseKey: category,
      lessonSlug: lesson,
    };
    if (next && !serverCompleted) justMarkedRef.current = true;
    if (completeFlushTimerRef.current) clearTimeout(completeFlushTimerRef.current);
    completeFlushTimerRef.current = setTimeout(flushToggleComplete, 5000);
  }, [isLoggedIn, lessonCompleted, serverCompleted, category, lesson, flushToggleComplete]);

  // Fire a keepalive request on tab close for any pending toggle — our fetch
  // client can't run during unload, so bypass it here.
  useEffect(() => {
    const onBeforeUnload = () => {
      const pending = pendingCompleteRef.current;
      if (!pending || pending.desired === pending.startingServer) return;
      try {
        fetch(`/api/progress/${pending.courseKey}/${pending.lessonSlug}/complete`, {
          method: pending.desired ? 'POST' : 'DELETE',
          credentials: 'include',
          keepalive: true,
        });
      } catch {
        // best effort
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  // On lesson change or unmount, flush the pending toggle synchronously. The
  // pending record still points at the previous lesson because handleToggle
  // captured it at click time, so the API call goes to the right slug even
  // after the URL has already swapped.
  useEffect(() => {
    return () => {
      flushToggleComplete();
    };
  }, [category, lesson, flushToggleComplete]);

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
        {/* Lesson content */}
        <div
          ref={contentRef}
          className={`${activeTab === 'lesson' ? 'block' : 'hidden'} lg:block w-full lg:w-[40%] overflow-y-auto bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border-r border-[var(--accent)]/30`}
        >
          <div className="px-9 py-8">
            {(() => {
              const { difficulty, rest } = parseDifficulty(title);
              return (
                <>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[1px] bg-[var(--accent)]/15 text-[var(--accent)]">
                      {t(isAlgo ? 'lesson.algoNofM' : 'lesson.lessonNofM', {
                        n: currentIndex + 1,
                        total: lessonList.length,
                      })}
                    </span>
                    {difficulty && (
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[1px]"
                        style={{
                          background: `color-mix(in srgb, ${DIFFICULTY_COLOR[difficulty]} 15%, transparent)`,
                          color: DIFFICULTY_COLOR[difficulty],
                        }}
                      >
                        {t(`lesson.difficulty.${difficulty}`)}
                      </span>
                    )}
                    {lessonCompleted && (
                      <span className="text-[var(--success)] text-xs font-semibold flex items-center gap-1">
                        {t('lesson.completed')}
                      </span>
                    )}
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

            <div className="flex gap-3 mt-10 pb-4">
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

        {/* Right panel: terminal or editor */}
        {isTerminal ? (
          <div
            className={`${activeTab === 'workspace' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[40%] flex-col bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border-l border-[var(--accent)]/30 overflow-hidden`}
          >
            <TerminalPanel
              lines={terminal.lines}
              cwd={terminal.cwd}
              isReady={terminal.isReady}
              isExecuting={terminal.isExecuting}
              onExecute={terminal.execute}
              onReset={terminal.reset}
              lessonCompleted={lessonCompleted}
              isMarking={isMarking}
              onMarkComplete={isLoggedIn ? handleToggleComplete : undefined}
              hasSolution={!!solution}
              onShowSolution={() => setShowSolution(true)}
            />
          </div>
        ) : (
          <div
            className={`${activeTab === 'workspace' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[40%] flex-col bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border-l border-[var(--accent)]/30 overflow-hidden`}
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
                          onClick={handleToggleComplete}
                          disabled={isMarking}
                          title={lessonCompleted ? t('lesson.unmarkTitle') : undefined}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border-none disabled:cursor-default disabled:opacity-70"
                        >
                          {isMarking
                            ? t('lesson.marking')
                            : lessonCompleted
                              ? t('lesson.unmark')
                              : t('lesson.markComplete')}
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

            <div className="overflow-auto bg-[rgba(13,17,23,0.3)]" style={{ maxHeight: '60%' }}>
              <CodeEditor
                value={userCode}
                onChange={setUserCode}
                language={category}
                fontSize="16px"
                onRun={handleRun}
              />
            </div>

            <div className="flex-1 min-h-0 p-3 border-t border-[var(--accent)]/20 bg-[rgba(22,22,29,0.15)] flex flex-col">
              <div className="flex gap-2 mb-3 items-center flex-wrap">
                <RunButton onClick={handleRun} isRunning={isRunning} />
              </div>

              <CodeOutput output={output} isRunning={isRunning} onInput={sendInput} fillHeight />
            </div>
          </div>
        )}
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
