import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCurriculum } from "../context/CurriculumContext";
import { useAllProgress } from "../context/ProgressContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { XPBar } from "../components/gamification/XPBar";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { COURSE_ICON } from "../constants/courses";
import { MAIN_COURSE_KEYS, progressPct } from "../../shared/constants";

export function CurriculumPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { courses: allCourses, isLoading: curriculumLoading } = useCurriculum();
  const { progressMap, isLoading: progressLoading } = useAllProgress();
  const gamification = useGamification();

  const courses = useMemo(
    () => allCourses.filter((c) => (MAIN_COURSE_KEYS as readonly string[]).includes(c.key)),
    [allCourses]
  );

  const isLoading = curriculumLoading || (isLoggedIn && progressLoading);

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

      <main className="flex-1 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-[36px] font-bold tracking-[-0.5px] mb-2">Curriculum</h1>
            <p className="text-[var(--text2)] text-base">
              Pick a language and start learning. Each lesson is interactive — read on the left, code on the right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {courses.map((course) => {
              const p = progressMap[course.key];
              const completed = p?.completed ?? 0;
              const total = p?.total ?? course.lessons.length;
              const pct = progressPct(completed, total);

              return (
                <button
                  key={course.key}
                  onClick={() => navigate(`/course/${course.key}`)}
                  className="text-left p-6 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] hover:border-[var(--accent)] transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{COURSE_ICON[course.key] ?? "📘"}</span>
                    <span className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] font-semibold">
                      {course.lessons.length} lessons
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-1.5 text-[var(--text)] group-hover:text-[var(--accent)] transition">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[var(--text2)] mb-5 leading-relaxed">
                    {course.description}
                  </p>

                  {isLoggedIn && (
                    <div>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-[var(--text3)]">
                          {completed} / {total} completed
                        </span>
                        <span className="text-[var(--text2)] font-semibold">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg3)] rounded-[3px] overflow-hidden">
                        <div
                          className="h-full bg-[var(--success)] rounded-[3px] transition-[width] duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
