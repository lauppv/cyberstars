import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCurriculum } from "../context/CurriculumContext";
import { useAllProgress } from "../context/ProgressContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { XPBar } from "../components/gamification/XPBar";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { COURSE_ICON } from "../constants/courses";
import { progressPct } from "../../shared/constants";

export function CourseLessonsPage() {
  const { courseKey = "" } = useParams<{ courseKey: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { courses, isLoading: curriculumLoading } = useCurriculum();
  const { progressMap, isLoading: progressLoading } = useAllProgress();
  const gamification = useGamification();

  const course = courses.find((c) => c.key === courseKey) ?? null;
  const progress = progressMap[courseKey] ?? null;

  const isLoading = curriculumLoading || (isLoggedIn && progressLoading);

  const completedSlugs = useMemo(
    () => new Set((progress?.lessons ?? []).filter((l) => l.completed).map((l) => l.slug)),
    [progress]
  );

  const completedCount = completedSlugs.size;
  const totalCount = course?.lessons.length ?? 0;
  const pct = progressPct(completedCount, totalCount);

  const continueSlug = useMemo(() => {
    if (!progress) return course?.lessons[0]?.slug;
    const lastStudied = progress.lessons
      .filter((l) => l.completed && l.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];
    if (!lastStudied) return course?.lessons[0]?.slug;
    return progress.lessons.find((l) => !l.completed)?.slug ?? lastStudied.slug;
  }, [progress, course]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-[var(--bg)]">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--text2)]">Course not found.</p>
        </div>
      </div>
    );
  }

  const hasStudied = progress && progress.lessons.some((l) => l.completed);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Topbar streak={gamification.streak} />

      {isLoggedIn && (
        <XPBar
          current={gamification.xpInLevel}
          max={gamification.xpForNextLevel}
          level={gamification.level}
        />
      )}

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[14px] overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center text-2xl bg-[var(--bg3)]">
                  {COURSE_ICON[course.key] ?? "📘"}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{course.title}</h1>
                  <p className="text-[var(--text3)] text-xs">{totalCount} lessons</p>
                </div>
              </div>

              {isLoggedIn && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-[var(--text3)]">{completedCount} / {totalCount} completed</span>
                    <span className="text-[var(--text2)] font-semibold">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg3)] rounded-[3px] overflow-hidden">
                    <div
                      className="h-full bg-[var(--success)] rounded-[3px] transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {isLoggedIn && continueSlug && hasStudied && (
                <button
                  onClick={() => navigate(`/lesson/${course.key}/${continueSlug}`)}
                  className="w-full py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 transition cursor-pointer"
                >
                  Continue where you left off →
                </button>
              )}
            </div>

            {/* Lesson list */}
            <nav className="max-h-[420px] overflow-y-auto px-3 py-3">
              {course.lessons.map((lesson, idx) => {
                const completed = completedSlugs.has(lesson.slug);
                return (
                  <button
                    key={lesson.slug}
                    onClick={() => navigate(`/lesson/${course.key}/${lesson.slug}`)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-left transition cursor-pointer hover:bg-[var(--surface)] group"
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 ${
                        completed
                          ? "bg-[var(--success)] text-black"
                          : "bg-[var(--bg3)] text-[var(--text3)]"
                      }`}
                    >
                      {completed ? "✓" : idx + 1}
                    </span>
                    <span className="text-[14px] font-medium leading-tight group-hover:text-[var(--accent)] transition">
                      {lesson.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="mt-4 text-[var(--text3)] text-[13px] hover:text-[var(--text)] transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
}
