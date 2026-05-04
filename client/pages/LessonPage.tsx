import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLesson } from "../hooks/useLesson";
import { useCodeExecution } from "../hooks/useCodeExecution";
import { useProgress } from "../hooks/useProgress";
import { useGamification } from "../hooks/useGamification";
import { useAuth } from "../context/AuthContext";
import { fetchCurriculum } from "../services/lessonService";
import { Topbar } from "../components/layout/Topbar";
import { Sidebar } from "../components/layout/Sidebar";
import { XPBar } from "../components/gamification/XPBar";
import { AchievementToast } from "../components/gamification/AchievementToast";
import { CodeEditor } from "../components/code/CodeEditor";
import { CodeOutput } from "../components/code/CodeOutput";
import { TestResults } from "../components/code/TestResults";
import { RunButton } from "../components/code/RunButton";
import { MarkdownRenderer } from "../components/markdown/MarkdownRenderer";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { Course, LessonMeta } from "../../shared/lesson";

const LANG_LABEL: Record<string, string> = { python: "Python 3", java: "Java", c: "C" };
const LANG_DOT: Record<string, string> = { python: "#3572A5", java: "#b07219", c: "#555555" };

export function LessonPage() {
  const navigate = useNavigate();
  const { category = "", lesson = "" } = useParams<{ category: string; lesson: string }>();
  const { isLoggedIn } = useAuth();

  const { title, content, codeTemplate, isLoading } = useLesson(category, lesson);
  const { output, isRunning, isSubmitting, submitResult, execute, submit } = useCodeExecution();
  const { saveCode, progress, loadProgress } = useProgress(category);
  const gamification = useGamification();

  const [userCode, setUserCode] = useState("");
  const [course, setCourse] = useState<Course | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ icon: "✅", title: "", xp: 15 });
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [editorWidth, setEditorWidth] = useState<number>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("editorWidth") : null;
    return saved ? Math.max(360, Math.min(1200, Number(saved))) : 560;
  });
  const isDraggingRef = useRef(false);

  const wasCompletedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const fromRight = window.innerWidth - e.clientX;
      const minWidth = 360;
      const maxWidth = Math.min(1200, window.innerWidth * 0.7);
      const next = Math.max(minWidth, Math.min(maxWidth, fromRight));
      setEditorWidth(next);
    };
    const onUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.localStorage.setItem("editorWidth", String(Math.round(editorWidth)));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [editorWidth]);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const lessonCompleted =
    progress?.lessons.find((l: any) => (l.lessonSlug ?? l.slug) === lesson)?.completed ?? false;

  useEffect(() => {
    setUserCode(codeTemplate);
  }, [codeTemplate]);

  useEffect(() => {
    fetchCurriculum()
      .then((courses) => {
        const c = courses.find((c) => c.key === category);
        if (c) setCourse(c);
      })
      .catch(() => {});
  }, [category]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    wasCompletedRef.current = lessonCompleted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson]);

  useEffect(() => {
    if (lessonCompleted && !wasCompletedRef.current) {
      wasCompletedRef.current = true;
      const isLast = course && course.lessons[course.lessons.length - 1].slug === lesson;
      setToastData({
        icon: isLast ? "🏆" : "✅",
        title: isLast ? "Course Milestone!" : "Lesson Complete!",
        xp: 15,
      });
      setShowToast(true);
    }
  }, [lessonCompleted, course, lesson]);

  const lessonList: LessonMeta[] = course?.lessons ?? [];
  const currentIndex = lessonList.findIndex((l) => l.slug === lesson);
  const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null;

  const completedSlugs = new Set<string>(
    (progress?.lessons ?? [])
      .filter((l: any) => l.completed)
      .map((l: any) => l.lessonSlug ?? l.slug)
  );

  const handleRun = useCallback(() => {
    execute(userCode, category);
  }, [execute, userCode, category]);

  const handleSubmit = useCallback(async () => {
    await submit(userCode, category, category, lesson);
    loadProgress();
  }, [submit, userCode, category, lesson, loadProgress]);

  const handleSave = useCallback(async () => {
    if (isLoggedIn) {
      await saveCode(lesson, userCode);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
    }
  }, [isLoggedIn, saveCode, lesson, userCode]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <Topbar
        breadcrumb={{ course: course?.title, lesson: title }}
        showSidebarToggle
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        streak={gamification.streak}
      />

      {isLoggedIn && (
        <XPBar
          current={gamification.xpInLevel}
          max={gamification.xpForNextLevel}
          level={gamification.level}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && course && (
          <Sidebar
            courseTitle={course.title}
            courseKey={course.key}
            lessons={lessonList}
            currentSlug={lesson}
            completedSlugs={completedSlugs}
            badges={gamification.badges}
          />
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Lesson content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto bg-[var(--bg)]">
            <div className="max-w-3xl mx-auto px-9 py-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[1px] bg-[var(--accent)]/15 text-[var(--accent)]">
                  Lesson {currentIndex + 1} of {lessonList.length}
                </span>
                {lessonCompleted && (
                  <span className="text-[var(--success)] text-xs font-semibold flex items-center gap-1">
                    ✓ Completed
                  </span>
                )}
              </div>

              <h1 className="text-[28px] font-bold tracking-[-0.5px] mb-6 text-[var(--text)]">
                {title}
              </h1>

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

          {/* Splitter handle */}
          <div
            onMouseDown={startDrag}
            className="w-1 flex-shrink-0 bg-[var(--border)] hover:bg-[var(--accent)] cursor-col-resize transition-colors relative group"
            title="Drag to resize editor"
          >
            <span className="absolute inset-y-0 -left-1 -right-1" />
          </div>

          {/* Editor panel */}
          <div
            className="flex flex-col bg-[var(--bg2)] border-l border-[var(--border)] overflow-hidden flex-shrink-0"
            style={{ width: editorWidth }}
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg3)] border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text2)]">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: LANG_DOT[category] ?? "#888" }}
                />
                {LANG_LABEL[category] ?? category.toUpperCase()}
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

            <div className="flex-1 overflow-auto bg-[#0D1117]">
              <CodeEditor
                value={userCode}
                onChange={setUserCode}
                language={category}
                fontSize="16px"
              />
            </div>

            <div className="p-3 border-t border-[var(--border)] bg-[var(--bg2)]">
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
        </div>
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
