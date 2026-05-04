import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurriculum } from "../services/lessonService";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../hooks/useGamification";
import * as progressService from "../services/progressService";
import { Topbar } from "../components/layout/Topbar";
import { XPBar } from "../components/gamification/XPBar";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { Course } from "../../shared/lesson";
import type { CourseProgress } from "../../shared/progress";

const COURSE_ICON: Record<string, string> = {
  python: "🐍",
  java: "☕",
  c: "⚙️",
};

export function CurriculumPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const gamification = useGamification();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCurriculum();
        setCourses(data);

        if (isLoggedIn) {
          const entries = await Promise.all(
            data.map(async (course) => {
              try {
                const p = await progressService.getCourseProgress(course.key);
                return [course.key, p] as const;
              } catch {
                return null;
              }
            })
          );
          const map: Record<string, CourseProgress> = {};
          for (const e of entries) if (e) map[e[0]] = e[1];
          setProgressMap(map);
        }
      } catch {}
      finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isLoggedIn]);

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
              const progress = progressMap[course.key];
              const completed = progress?.completed ?? 0;
              const total = progress?.total ?? course.lessons.length;
              const pct = total > 0 ? (completed / total) * 100 : 0;

              return (
                <button
                  key={course.key}
                  onClick={() => {
                    const firstSlug = course.lessons[0]?.slug;
                    if (firstSlug) navigate(`/lesson/${course.key}/${firstSlug}`);
                  }}
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
                          {Math.round(pct)}%
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
