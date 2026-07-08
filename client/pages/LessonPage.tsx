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
import { TerminalPanel } from '../components/terminal/TerminalPanel';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { LessonMeta } from '../../shared/lesson';
import * as progressService from '../services/progressService';
import { courseMeta } from '../constants/courses';
import { TERMINAL_COURSE_KEYS } from '../../shared/constants';

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

  const justMarkedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveToastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const loadedLessonRef = useRef('');
  const loadedStarterRef = useRef('');

  const course = courses.find((c) => c.key === category) ?? null;

  const lessonCompleted = progress?.lessons.find((l) => l.slug === lesson)?.completed ?? false;

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

  const handleMarkComplete = useCallback(async () => {
    if (!isLoggedIn || lessonCompleted) return;
    setIsMarking(true);
    try {
      justMarkedRef.current = true;
      await progressService.markLessonComplete(category, lesson);
      loadProgress();
      refreshGamification();
    } finally {
      setIsMarking(false);
    }
  }, [isLoggedIn, lessonCompleted, category, lesson, loadProgress, refreshGamification]);

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
                      {t('lesson.lessonNofM', {
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
              onMarkComplete={isLoggedIn ? handleMarkComplete : undefined}
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
                {solution && (
                  <button
                    onClick={() => setShowSolution(true)}
                    className="text-[12px] px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--warning)]/10 border border-[var(--warning)]/30 text-[var(--warning)] font-semibold hover:bg-[var(--warning)]/20 transition cursor-pointer"
                  >
                    {t('lesson.showSolution')}
                  </button>
                )}
                {isLoggedIn && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={lessonCompleted || isMarking}
                    className={`text-[12px] px-3 py-1 rounded-[var(--radius-sm)] transition cursor-pointer border ${
                      lessonCompleted
                        ? 'bg-[var(--success)]/15 border-[var(--success)]/30 text-[var(--success)]'
                        : 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/20'
                    } font-semibold disabled:cursor-default`}
                  >
                    {lessonCompleted
                      ? t('lesson.completed')
                      : isMarking
                        ? t('lesson.marking')
                        : t('lesson.markComplete')}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm(t('lesson.confirmReset'))) setUserCode(starterCode);
                  }}
                  className="text-[12px] text-[var(--text3)] hover:text-[var(--text)] px-2 py-1 rounded transition cursor-pointer bg-transparent border-none"
                  title={t('lesson.resetTitle')}
                >
                  {t('lesson.reset')}
                </button>
                {isLoggedIn && (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] text-[13px] font-semibold hover:text-[var(--text)] transition cursor-pointer"
                    >
                      {t('lesson.save')}
                    </button>
                    {showSaveToast && (
                      <span className="text-[var(--success)] text-[12px] font-semibold animate-pulse">
                        {t('lesson.codeSaved')}
                      </span>
                    )}
                  </>
                )}
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
    </div>
  );
}
