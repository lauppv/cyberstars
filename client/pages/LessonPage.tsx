import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLesson } from "../hooks/useLesson";
import { useCodeExecution } from "../hooks/useCodeExecution";
import { useTerminalSession } from "../hooks/useTerminalSession";
import { useProgress } from "../hooks/useProgress";
import { useGamification, recordActivityToday } from "../hooks/useGamification";
import { useAuth } from "../context/AuthContext";
import { useCurriculum } from "../context/CurriculumContext";
import { Topbar } from "../components/layout/Topbar";
import { XPBar } from "../components/gamification/XPBar";
import { AchievementToast } from "../components/gamification/AchievementToast";
import { CodeEditor } from "../components/code/CodeEditor";
import { CodeOutput } from "../components/code/CodeOutput";
import { TestResults } from "../components/code/TestResults";
import { RunButton } from "../components/code/RunButton";
import { TerminalPanel } from "../components/terminal/TerminalPanel";
import { MarkdownRenderer } from "../components/markdown/MarkdownRenderer";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { Course, LessonMeta } from "../../shared/lesson";
import * as progressService from "../services/progressService";
import { courseMeta } from "../constants/courses";
import { xpForLesson, TERMINAL_COURSE_KEYS } from "../../shared/constants";

function parseDifficulty(title: string): { difficulty: "Easy" | "Medium" | "Hard" | null; rest: string } {
  const m = title.match(/^(Easy|Medium|Hard)\s*[·-]\s*(.+)$/i);
  if (!m) return { difficulty: null, rest: title };
  const d = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
  return { difficulty: d as "Easy" | "Medium" | "Hard", rest: m[2] };
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "var(--success)",
  Medium: "var(--warning)",
  Hard: "var(--error)",
};

export function LessonPage() {
  const navigate = useNavigate();
  const { category = "", lesson = "" } = useParams<{ category: string; lesson: string }>();
  const { isLoggedIn, user } = useAuth();

  const isTerminal = (TERMINAL_COURSE_KEYS as readonly string[]).includes(category);

  const { title, content, codeTemplate, isLoading } = useLesson(category, lesson);
  const { output, isRunning, isSubmitting, submitResult, execute, submit } = useCodeExecution();
  const terminal = useTerminalSession(isTerminal ? category : "", isTerminal ? lesson : "");
  const { saveCode, progress, loadProgress } = useProgress(category);
  const gamification = useGamification();
  const { refresh: refreshGamification } = gamification;
  const { courses } = useCurriculum();

  const [userCode, setUserCode] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ icon: "✅", title: "", xp: 0 });
  const [showSaveToast, setShowSaveToast] = useState(false);

  const justSubmittedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveToastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const course = courses.find((c) => c.key === category) ?? null;

  const lessonCompleted =
    progress?.lessons.find((l) => l.slug === lesson)?.completed ?? false;

  useEffect(() => {
    setUserCode(codeTemplate); // eslint-disable-line react-hooks/set-state-in-effect
  }, [codeTemplate]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    justSubmittedRef.current = false;
  }, [lesson]);

  useEffect(() => {
    if (isLoggedIn && category && lesson) {
      progressService.trackAccess(category, lesson).catch(() => {});
    }
  }, [isLoggedIn, category, lesson]);

  useEffect(() => {
    if (lessonCompleted && justSubmittedRef.current) {
      justSubmittedRef.current = false;
      if (user) recordActivityToday(user.id);
      const isLast = course && course.lessons[course.lessons.length - 1].slug === lesson;
      const lessonMeta = course?.lessons.find((l) => l.slug === lesson);
      setToastData({
        icon: isLast ? "🏆" : "✅",
        title: isLast ? "Course Milestone!" : "Lesson Complete!",
        xp: xpForLesson(lessonMeta?.sortOrder ?? 1),
      });
      setShowToast(true);
    }
  }, [lessonCompleted, course, lesson]);

  const lessonList: LessonMeta[] = course?.lessons ?? [];
  const currentIndex = lessonList.findIndex((l) => l.slug === lesson);
  const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null;

  const handleRun = useCallback(() => {
    execute(userCode, category);
  }, [execute, userCode, category]);

  const handleSubmit = useCallback(async () => {
    justSubmittedRef.current = true;
    await submit(userCode, category, category, lesson);
    loadProgress();
    refreshGamification();
  }, [submit, userCode, category, lesson, loadProgress, refreshGamification]);

  const handleSave = useCallback(async () => {
    if (isLoggedIn) {
      await saveCode(lesson, userCode);
      setShowSaveToast(true);
      if (saveToastTimer.current) clearTimeout(saveToastTimer.current);
      saveToastTimer.current = setTimeout(() => setShowSaveToast(false), 2000);
    }
  }, [isLoggedIn, saveCode, lesson, userCode]);

  useEffect(() => {
    return () => { if (saveToastTimer.current) clearTimeout(saveToastTimer.current); };
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
          courseHref: category.startsWith("algo-")
            ? `/algorithms/${category.replace("algo-", "")}`
            : "/courses",
        }}
        streak={gamification.streak}
      />

      {isLoggedIn && (
        <XPBar
          current={gamification.xpInLevel}
          max={gamification.xpForNextLevel}
          level={gamification.level}
        />
      )}

      <div className="flex flex-1 overflow-hidden justify-center">
          {/* Lesson content */}
          <div ref={contentRef} className="w-[40%] overflow-y-auto bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border-r border-[var(--accent)]/30">
            <div className="px-9 py-8">
              {(() => {
                const { difficulty, rest } = parseDifficulty(title);
                return (
                  <>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[1px] bg-[var(--accent)]/15 text-[var(--accent)]">
                        Lesson {currentIndex + 1} of {lessonList.length}
                      </span>
                      {difficulty && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[1px]"
                          style={{
                            background: `color-mix(in srgb, ${DIFFICULTY_COLOR[difficulty]} 15%, transparent)`,
                            color: DIFFICULTY_COLOR[difficulty],
                          }}
                        >
                          {difficulty}
                        </span>
                      )}
                      {lessonCompleted && (
                        <span className="text-[var(--success)] text-xs font-semibold flex items-center gap-1">
                          ✓ Completed
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
                  ← Previous
                </button>
                <button
                  onClick={() => nextLesson && navigate(`/lesson/${category}/${nextLesson.slug}`)}
                  disabled={!nextLesson}
                  className="px-5 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: terminal or editor */}
          {isTerminal ? (
            <div className="w-[40%] flex flex-col bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border-l border-[var(--accent)]/30 overflow-hidden">
              <TerminalPanel
                lines={terminal.lines}
                cwd={terminal.cwd}
                isReady={terminal.isReady}
                isExecuting={terminal.isExecuting}
                isSubmitting={terminal.isSubmitting}
                submitResult={terminal.submitResult}
                onExecute={terminal.execute}
                onSubmit={async () => {
                  justSubmittedRef.current = true;
                  const result = await terminal.submit();
                  if (result?.allPassed) {
                    loadProgress();
                    refreshGamification();
                  }
                }}
                onReset={terminal.reset}
              />
            </div>
          ) : (
          <div className="w-[40%] flex flex-col bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border-l border-[var(--accent)]/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(30,30,40,0.3)] border-b border-[var(--accent)]/20">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text2)]">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: courseMeta(category).color }}
                />
                {courseMeta(category).langLabel}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserCode(codeTemplate)}
                  className="text-[12px] text-[var(--text3)] hover:text-[var(--text)] px-2 py-1 rounded transition cursor-pointer bg-transparent border-none"
                  title="Reset code"
                >
                  ↺ Reset
                </button>
                <RunButton onClick={handleRun} isRunning={isRunning} />
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[rgba(13,17,23,0.3)]">
              <CodeEditor
                value={userCode}
                onChange={setUserCode}
                language={category}
                fontSize="16px"
              />
            </div>

            <div className="p-3 border-t border-[var(--accent)]/20 bg-[rgba(22,22,29,0.15)]">
              <div className="flex gap-2 mb-3 items-center flex-wrap">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-4 py-1.5 rounded-[var(--radius-sm)] text-[13px] font-semibold transition cursor-pointer disabled:opacity-50 ${
                    submitResult?.allPassed || (lessonCompleted && !submitResult)
                      ? "bg-[var(--success)]/20 border border-[var(--success)]/40 text-[var(--success)]"
                      : "bg-[var(--accent)] text-white hover:brightness-110"
                  }`}
                >
                  {isSubmitting
                    ? "Testing..."
                    : submitResult?.allPassed
                    ? "✓ Submitted"
                    : lessonCompleted && !submitResult
                    ? "✓ Submitted"
                    : "Submit"}
                </button>
                {isLoggedIn && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] text-[13px] font-semibold hover:text-[var(--text)] transition cursor-pointer"
                  >
                    💾 Save
                  </button>
                )}
                {showSaveToast && (
                  <span className="text-[var(--success)] text-[12px] font-semibold animate-pulse">
                    Code saved!
                  </span>
                )}
              </div>

              {submitResult ? (
                <TestResults result={submitResult} />
              ) : (
                <CodeOutput output={output} height="180px" />
              )}
            </div>
          </div>
          )}
      </div>

      <AchievementToast
        icon={toastData.icon}
        title={toastData.title}
        xp={toastData.xp}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
