import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Topbar } from "../components/layout/Topbar";
import { useGamification } from "../hooks/useGamification";
import { useAuth } from "../context/AuthContext";
import { useCurriculum } from "../context/CurriculumContext";
import * as progressService from "../services/progressService";
import { COURSE_ICON, COURSE_COLOR, COURSE_LEVEL } from "../constants/courses";
import { XP_PER_LESSON } from "../../shared/constants";
import type { Course } from "../../shared/lesson";

interface CourseData {
  key: string;
  icon: string;
  name: string;
  color: string;
  level: "beginner" | "intermediate" | "advanced";
  lessons: number;
  xpTotal: number;
  progress: number;
  desc: string;
  chapters: { name: string; done: boolean }[];
  firstSlug?: string;
}

const FILTERS = [
  { key: "all", label: "All Courses" },
  { key: "python", label: "🐍 Python" },
  { key: "java", label: "☕ Java" },
  { key: "c", label: "⚙️ C" },
  { key: "algo", label: "🧩 Algorithms" },
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
] as const;

const LEVEL_CLASSES: Record<string, string> = {
  beginner: "bg-[rgba(0,214,143,0.1)] text-[var(--success)]",
  intermediate: "bg-[rgba(255,170,0,0.1)] text-[var(--warning)]",
  advanced: "bg-[rgba(255,107,107,0.1)] text-[var(--error)]",
};

function buildCourseData(course: Course): CourseData {
  return {
    key: course.key,
    icon: COURSE_ICON[course.key] ?? "📘",
    name: course.title,
    color: COURSE_COLOR[course.key] ?? "#6C5CE7",
    level: COURSE_LEVEL[course.key] ?? "beginner",
    lessons: course.lessons.length,
    xpTotal: course.lessons.length * XP_PER_LESSON,
    progress: 0,
    desc: course.description,
    chapters: course.lessons.map((l) => ({ name: l.title, done: false })),
    firstSlug: course.lessons[0]?.slug,
  };
}

function filterCourses(courses: CourseData[], filter: string): CourseData[] {
  if (filter === "all") return courses;
  if (["beginner", "intermediate", "advanced"].includes(filter)) {
    return courses.filter((c) => c.level === filter);
  }
  return courses.filter((c) => c.key === filter);
}

export function CoursesPage() {
  const navigate = useNavigate();
  const g = useGamification();
  const { isLoggedIn } = useAuth();
  const { courses: serverCourses, isLoading: curriculumLoading } = useCurriculum();
  const [filter, setFilter] = useState("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (curriculumLoading) return;
    (async () => {
      try {
        const courses = serverCourses.map(buildCourseData);

        if (isLoggedIn) {
          await Promise.all(
            serverCourses.map(async (sc, idx) => {
              try {
                const p = await progressService.getCourseProgress(sc.key);
                if (p.total > 0) {
                  courses[idx] = {
                    ...courses[idx],
                    progress: Math.round((p.completed / p.total) * 100),
                    chapters: courses[idx].chapters.map((ch, i) => ({
                      ...ch,
                      done: p.lessons[i]?.completed ?? false,
                    })),
                  };
                }
              } catch {}
            })
          );
        }

        setAllCourses(courses);
      } catch {}
      setIsLoading(false);
    })();
  }, [serverCourses, curriculumLoading, isLoggedIn]);

  const filtered = filterCourses(allCourses, filter);
  const syllabus = selectedKey ? allCourses.find((c) => c.key === selectedKey) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Topbar streak={g.streak} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-[var(--text3)]">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Topbar streak={g.streak} />

      <main className="flex-1 max-w-[1040px] mx-auto w-full px-7 py-8 pb-16">
        <div className="mb-7">
          <h1 className="text-[28px] font-bold mb-1.5" style={{ letterSpacing: "-0.5px" }}>
            Courses
          </h1>
          <p className="text-sm text-[var(--text2)] leading-relaxed">
            Structured learning paths in Python, Java, and C. Pick a course and start building.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                filter === f.key
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                  : "bg-transparent border border-[var(--border)] text-[var(--text2)] hover:border-[var(--text3)] hover:text-[var(--text)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div
              key={c.key}
              onClick={() => setSelectedKey(c.key)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#0004]"
            >
              <div className="h-1.5 w-full" style={{ background: c.color }} />
              <div className="p-5">
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: c.color + "20" }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold mb-0.5" style={{ letterSpacing: "-0.2px" }}>
                      {c.name}
                    </div>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-[10px] ${LEVEL_CLASSES[c.level]}`}
                    >
                      {c.level}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-4">{c.desc}</p>
                <div className="flex gap-4 mb-4">
                  <span className="text-[11px] text-[var(--text3)]">
                    <strong className="text-[var(--text2)]">{c.lessons}</strong> lessons
                  </span>
                  <span className="text-[11px] text-[var(--text3)]">
                    <strong className="text-[var(--text2)]">{c.xpTotal}</strong> XP
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {c.progress > 0 ? (
                    <>
                      <div className="flex-1 mr-3">
                        <div className="text-[11px] text-[var(--text3)] mb-1">{c.progress}% complete</div>
                        <div className="h-1 bg-[var(--bg3)] rounded-sm overflow-hidden">
                          <div
                            className="h-full rounded-sm transition-[width] duration-400"
                            style={{ width: `${c.progress}%`, background: c.color }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (c.firstSlug) {
                            navigate(`/lesson/${c.key}/${c.firstSlug}`);
                          }
                        }}
                        className="px-4 py-[7px] rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-xs font-semibold cursor-pointer border-none hover:brightness-110 transition flex-shrink-0"
                      >
                        Continue
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKey(c.key);
                      }}
                      className="px-4 py-[7px] rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text)] text-xs font-semibold cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                    >
                      View Syllabus →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Syllabus drawer */}
      {syllabus && (
        <>
          <div
            className="fixed inset-0 bg-black/65 z-[100] animate-fade-in"
            onClick={() => setSelectedKey(null)}
          />
          <div
            className="fixed right-0 top-0 bottom-0 w-[440px] max-w-full bg-[var(--bg2)] border-l border-[var(--border)] overflow-y-auto z-[101]"
            style={{ animation: "slideIn 0.3s cubic-bezier(.22,1,.36,1)" }}
          >
            <div className="flex items-start gap-3.5 p-6 pb-5 border-b border-[var(--border)]">
              <div
                className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] flex-shrink-0"
                style={{ background: syllabus.color + "20" }}
              >
                {syllabus.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl font-bold mb-1">{syllabus.name}</div>
                <div className="flex gap-3 text-xs text-[var(--text3)]">
                  <span>{syllabus.lessons} lessons</span>
                  <span>{syllabus.xpTotal} XP total</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedKey(null)}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition flex-shrink-0"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 text-[13px] text-[var(--text2)] leading-relaxed border-b border-[var(--border)]">
              {syllabus.desc}
            </div>

            <div className="px-6 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
                Lessons
              </div>
              <div className="flex flex-col gap-1">
                {syllabus.chapters.map((ch, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition"
                  >
                    <div
                      className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${
                        ch.done
                          ? "bg-[var(--success)] text-white"
                          : "bg-[var(--bg3)] text-[var(--text3)]"
                      }`}
                    >
                      {ch.done ? "✓" : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium">{ch.name}</div>
                    </div>
                    <div className="text-[11px] font-semibold text-[var(--accent)]">+{XP_PER_LESSON} XP</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[var(--border)]">
              <button
                onClick={() => {
                  if (syllabus.firstSlug) {
                    navigate(`/lesson/${syllabus.key}/${syllabus.firstSlug}`);
                  }
                }}
                className="w-full py-3 bg-[var(--accent)] text-white rounded-[var(--radius)] text-sm font-semibold cursor-pointer border-none hover:brightness-110 transition"
              >
                {syllabus.progress > 0 ? "Continue Learning →" : "Start Course →"}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
