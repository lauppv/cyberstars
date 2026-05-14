import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Topbar } from "../components/layout/Topbar";
import { useGamification } from "../hooks/useGamification";
import { useAuth } from "../context/AuthContext";
import { fetchCurriculum } from "../services/lessonService";
import * as progressService from "../services/progressService";

interface Chapter {
  name: string;
  detail: string;
  xp: number;
  done: boolean;
}

interface CourseData {
  id: string;
  icon: string;
  name: string;
  color: string;
  level: "beginner" | "intermediate" | "advanced";
  lessons: number;
  hours: number;
  xpTotal: number;
  progress: number;
  desc: string;
  chapters: Chapter[];
  serverKey?: string;
  firstSlug?: string;
}

const COURSE_ICON: Record<string, string> = {
  python: "🐍",
  java: "☕",
  c: "⚙️",
  algo: "🧩",
};

const COURSE_COLOR: Record<string, string> = {
  python: "#3572A5",
  java: "#b07219",
  c: "#555555",
  algo: "#6C5CE7",
};

const COURSE_LEVEL: Record<string, "beginner" | "intermediate" | "advanced"> = {
  python: "beginner",
  java: "beginner",
  c: "beginner",
  algo: "intermediate",
};

const COURSE_DESC: Record<string, string> = {
  python: "Start your coding journey with Python. Learn variables, loops, functions, and build your first real programs.",
  java: "Learn Java from scratch — types, control flow, methods, and object-oriented programming.",
  c: "Understand how computers work at a low level — memory, pointers, structs, and system programming in C.",
  algo: "Classic algorithms and problem-solving techniques. Sharpen your coding skills with hands-on challenges.",
};

const STATIC_COURSES: CourseData[] = [
  {
    id: "py-fundamentals", icon: "🐍", name: "Python Fundamentals", color: "#3572A5",
    level: "beginner", lessons: 12, hours: 6, xpTotal: 600, progress: 0,
    desc: "Start your coding journey with Python. Learn variables, loops, functions, and build your first real programs.",
    chapters: [
      { name: "Intro to Python", detail: "Setup & your first print()", xp: 30, done: false },
      { name: "Variables & Data Types", detail: "Strings, ints, floats, bools", xp: 50, done: false },
      { name: "Loops & Iteration", detail: "for, while, range()", xp: 50, done: false },
      { name: "Conditionals", detail: "if, elif, else, logic", xp: 50, done: false },
      { name: "Functions", detail: "def, args, return values", xp: 50, done: false },
      { name: "Lists & Tuples", detail: "Indexing, slicing, methods", xp: 50, done: false },
      { name: "Dictionaries & Sets", detail: "Key-value pairs, lookups", xp: 50, done: false },
      { name: "String Magic", detail: "f-strings, methods, formatting", xp: 40, done: false },
      { name: "File I/O", detail: "Reading & writing files", xp: 50, done: false },
      { name: "Error Handling", detail: "try, except, finally", xp: 50, done: false },
      { name: "Modules & Imports", detail: "Using libraries, pip", xp: 40, done: false },
      { name: "Final Project", detail: "Build a text adventure game", xp: 90, done: false },
    ],
    serverKey: "python",
  },
  {
    id: "py-intermediate", icon: "🐍", name: "Python Intermediate", color: "#3572A5",
    level: "intermediate", lessons: 10, hours: 8, xpTotal: 800, progress: 0,
    desc: "Level up with list comprehensions, OOP, decorators, and real-world projects.",
    chapters: [
      { name: "List Comprehensions", detail: "Concise list building", xp: 60, done: false },
      { name: "Classes & Objects", detail: "OOP fundamentals", xp: 80, done: false },
      { name: "Inheritance", detail: "Subclasses, super(), MRO", xp: 80, done: false },
      { name: "Decorators", detail: "Wrapping functions", xp: 70, done: false },
      { name: "Generators", detail: "yield, lazy evaluation", xp: 70, done: false },
      { name: "Lambda & Map/Filter", detail: "Functional programming", xp: 60, done: false },
      { name: "Regular Expressions", detail: "Pattern matching", xp: 80, done: false },
      { name: "APIs & JSON", detail: "HTTP requests, parsing", xp: 80, done: false },
      { name: "Testing", detail: "unittest, assertions", xp: 70, done: false },
      { name: "Final Project", detail: "Build a weather CLI app", xp: 150, done: false },
    ],
  },
  {
    id: "java-basics", icon: "☕", name: "Java Basics", color: "#b07219",
    level: "beginner", lessons: 14, hours: 10, xpTotal: 900, progress: 0,
    desc: "Learn Java from scratch — types, control flow, methods, and object-oriented programming.",
    chapters: [
      { name: "Hello Java", detail: "main(), System.out.println", xp: 30, done: false },
      { name: "Variables & Types", detail: "int, String, double, boolean", xp: 50, done: false },
      { name: "Operators", detail: "Arithmetic, comparison, logical", xp: 40, done: false },
      { name: "If/Else & Switch", detail: "Branching logic", xp: 50, done: false },
      { name: "Loops", detail: "for, while, do-while", xp: 50, done: false },
      { name: "Arrays", detail: "Declaring, iterating, 2D", xp: 60, done: false },
      { name: "Methods", detail: "Parameters, return, overloading", xp: 60, done: false },
      { name: "Classes & Objects", detail: "Fields, constructors, this", xp: 80, done: false },
      { name: "Inheritance", detail: "extends, super, polymorphism", xp: 80, done: false },
      { name: "Interfaces", detail: "Contracts, implements", xp: 70, done: false },
      { name: "Exceptions", detail: "try/catch, throws", xp: 60, done: false },
      { name: "Collections", detail: "ArrayList, HashMap", xp: 70, done: false },
      { name: "File I/O", detail: "Scanner, BufferedReader", xp: 60, done: false },
      { name: "Final Project", detail: "Build a student grade tracker", xp: 140, done: false },
    ],
    serverKey: "java",
  },
  {
    id: "java-oop", icon: "☕", name: "Java OOP Deep Dive", color: "#b07219",
    level: "intermediate", lessons: 10, hours: 9, xpTotal: 850, progress: 0,
    desc: "Master object-oriented design patterns, generics, lambdas, and streams in Java.",
    chapters: [
      { name: "Design Principles", detail: "SOLID, DRY, KISS", xp: 70, done: false },
      { name: "Abstract Classes", detail: "Templates, contracts", xp: 80, done: false },
      { name: "Generics", detail: "Type safety, wildcards", xp: 90, done: false },
      { name: "Enums", detail: "Type-safe constants", xp: 60, done: false },
      { name: "Lambda Expressions", detail: "Functional interfaces", xp: 80, done: false },
      { name: "Streams API", detail: "map, filter, reduce", xp: 90, done: false },
      { name: "Optional", detail: "Null safety", xp: 60, done: false },
      { name: "Design Patterns", detail: "Singleton, Factory, Observer", xp: 100, done: false },
      { name: "Concurrency", detail: "Threads, synchronized", xp: 100, done: false },
      { name: "Final Project", detail: "Build a task manager app", xp: 120, done: false },
    ],
  },
  {
    id: "c-programming", icon: "⚙️", name: "C Programming", color: "#555555",
    level: "beginner", lessons: 10, hours: 8, xpTotal: 700, progress: 0,
    desc: "Understand how computers work at a low level — memory, pointers, structs, and system programming in C.",
    chapters: [
      { name: "Hello C", detail: "#include, main(), printf", xp: 30, done: false },
      { name: "Variables & Types", detail: "int, char, float, sizeof", xp: 50, done: false },
      { name: "Control Flow", detail: "if, for, while, switch", xp: 60, done: false },
      { name: "Functions", detail: "Prototypes, params, return", xp: 60, done: false },
      { name: "Arrays & Strings", detail: "char arrays, string.h", xp: 70, done: false },
      { name: "Pointers", detail: "Addresses, dereferencing", xp: 90, done: false },
      { name: "Dynamic Memory", detail: "malloc, free, realloc", xp: 90, done: false },
      { name: "Structs", detail: "Custom types, typedef", xp: 70, done: false },
      { name: "File I/O", detail: "fopen, fread, fwrite", xp: 70, done: false },
      { name: "Final Project", detail: "Build a linked list library", xp: 110, done: false },
    ],
    serverKey: "c",
  },
  {
    id: "c-advanced", icon: "⚙️", name: "C Systems Programming", color: "#555555",
    level: "advanced", lessons: 8, hours: 12, xpTotal: 1000, progress: 0,
    desc: "Dive into systems programming — processes, sockets, makefiles, and building your own shell.",
    chapters: [
      { name: "Preprocessor", detail: "#define, #ifdef, macros", xp: 80, done: false },
      { name: "Bitwise Operations", detail: "AND, OR, XOR, shifting", xp: 100, done: false },
      { name: "Function Pointers", detail: "Callbacks, vtables", xp: 120, done: false },
      { name: "Memory Layout", detail: "Stack, heap, segments", xp: 120, done: false },
      { name: "Processes", detail: "fork(), exec(), wait()", xp: 130, done: false },
      { name: "Signals", detail: "Handling, sigaction", xp: 110, done: false },
      { name: "Sockets", detail: "TCP, client/server", xp: 140, done: false },
      { name: "Final Project", detail: "Build a mini shell", xp: 200, done: false },
    ],
  },
];

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

function filterCourses(courses: CourseData[], filter: string): CourseData[] {
  if (filter === "all") return courses;
  if (filter === "python") return courses.filter((c) => c.icon === "🐍");
  if (filter === "java") return courses.filter((c) => c.icon === "☕");
  if (filter === "c") return courses.filter((c) => c.icon === "⚙️");
  if (filter === "algo") return courses.filter((c) => c.icon === "🧩");
  return courses.filter((c) => c.level === filter);
}

export function CoursesPage() {
  const navigate = useNavigate();
  const g = useGamification();
  const { isLoggedIn } = useAuth();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<CourseData[]>(STATIC_COURSES);

  // Load server courses (including algo) and merge with static data
  useEffect(() => {
    (async () => {
      try {
        const serverCourses = await fetchCurriculum();
        const merged = [...STATIC_COURSES];
        const existingKeys = new Set(STATIC_COURSES.map((c) => c.serverKey).filter(Boolean));

        for (const sc of serverCourses) {
          if (existingKeys.has(sc.key)) {
            // Update matching static course with real lesson count
            const idx = merged.findIndex((c) => c.serverKey === sc.key);
            if (idx >= 0) {
              merged[idx] = {
                ...merged[idx],
                lessons: sc.lessons.length,
                firstSlug: sc.lessons[0]?.slug,
                chapters: sc.lessons.map((l) => ({
                  name: l.title,
                  detail: "",
                  xp: 15,
                  done: false,
                })),
              };
            }
          } else {
            // Add server-only courses (like algo)
            merged.push({
              id: sc.key,
              icon: COURSE_ICON[sc.key] ?? "📘",
              name: sc.title,
              color: COURSE_COLOR[sc.key] ?? "#6C5CE7",
              level: COURSE_LEVEL[sc.key] ?? "intermediate",
              lessons: sc.lessons.length,
              hours: Math.ceil(sc.lessons.length * 0.5),
              xpTotal: sc.lessons.length * 15,
              progress: 0,
              desc: COURSE_DESC[sc.key] ?? sc.description,
              chapters: sc.lessons.map((l) => ({
                name: l.title,
                detail: "",
                xp: 15,
                done: false,
              })),
              serverKey: sc.key,
              firstSlug: sc.lessons[0]?.slug,
            });
          }
        }

        // Load progress for logged-in users
        if (isLoggedIn) {
          for (const sc of serverCourses) {
            try {
              const p = await progressService.getCourseProgress(sc.key);
              const idx = merged.findIndex((c) => c.serverKey === sc.key || c.id === sc.key);
              if (idx >= 0 && p.total > 0) {
                merged[idx] = {
                  ...merged[idx],
                  progress: Math.round((p.completed / p.total) * 100),
                  chapters: merged[idx].chapters.map((ch, i) => ({
                    ...ch,
                    done: p.lessons[i]?.completed ?? false,
                  })),
                };
              }
            } catch {}
          }
        }

        setAllCourses(merged);
      } catch {}
    })();
  }, [isLoggedIn]);

  const filtered = filterCourses(allCourses, filter);
  const syllabus = selectedId ? allCourses.find((c) => c.id === selectedId) : null;

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
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#0004]"
            >
              {/* Color banner */}
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
                    <strong className="text-[var(--text2)]">{c.hours}</strong>h estimated
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
                          if (c.serverKey && c.firstSlug) {
                            navigate(`/lesson/${c.serverKey}/${c.firstSlug}`);
                          } else {
                            navigate("/curriculum");
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
                        setSelectedId(c.id);
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
            onClick={() => setSelectedId(null)}
          />
          <div
            className="fixed right-0 top-0 bottom-0 w-[440px] max-w-full bg-[var(--bg2)] border-l border-[var(--border)] overflow-y-auto z-[101]"
            style={{ animation: "slideIn 0.3s cubic-bezier(.22,1,.36,1)" }}
          >
            {/* Header */}
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
                  <span>{syllabus.hours}h estimated</span>
                  <span>{syllabus.xpTotal} XP total</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition flex-shrink-0"
              >
                ×
              </button>
            </div>

            {/* Description */}
            <div className="px-6 py-5 text-[13px] text-[var(--text2)] leading-relaxed border-b border-[var(--border)]">
              {syllabus.desc}
            </div>

            {/* Chapters */}
            <div className="px-6 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
                Chapters
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
                      <div className="text-[11px] text-[var(--text3)] mt-px">{ch.detail}</div>
                    </div>
                    <div className="text-[11px] font-semibold text-[var(--accent)]">+{ch.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start button */}
            <div className="px-6 py-4 border-t border-[var(--border)]">
              <button
                onClick={() => {
                  if (syllabus.serverKey && syllabus.firstSlug) {
                    navigate(`/lesson/${syllabus.serverKey}/${syllabus.firstSlug}`);
                  } else {
                    navigate("/curriculum");
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
