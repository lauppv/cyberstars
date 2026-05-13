import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { fetchCurriculum } from "../services/lessonService";
import * as progressService from "../services/progressService";
import type { Course } from "../../shared/lesson";

const COURSE_ICON: Record<string, string> = {
  python: "🐍",
  java: "☕",
  c: "⚙️",
  algo: "🧩",
};

const COURSE_DESC: Record<string, string> = {
  python: "Variables, loops, functions, and your first real programs.",
  java: "Object-oriented programming from the ground up.",
  c: "Memory, pointers, and low-level system programming.",
  algo: "Classic algorithms and problem-solving techniques.",
};

const TOUR_STEPS = [
  { icon: "👋", title: "Welcome to CyberStars!", body: "We're excited to have you. Let's take a quick tour of the platform so you know where everything is." },
  { icon: "📚", title: "Choose Your Path", body: "Pick from Python, Java, or C. Each course has structured lessons that build on each other — from basics to advanced topics." },
  { icon: "⌨️", title: "Code as You Learn", body: "Every lesson has a built-in code editor. Read the explanation on the left, then practice on the right — no setup needed." },
  { icon: "🏆", title: "Earn XP & Badges", body: "Complete lessons to earn XP, maintain your daily streak, and unlock badges. Climb the leaderboard and show off your skills!" },
  { icon: "✨", title: "Never Get Stuck", body: "Our AI-powered hints are always one click away. Ask CyberBot for help whenever you need a nudge in the right direction." },
];

const ACTIVITY_DATA = [
  { color: "var(--success)", text: "Completed \"Variables & Types\"", time: "2h ago" },
  { color: "var(--accent)", text: "Earned 15 XP", time: "2h ago" },
  { color: "var(--warning)", text: "Started Java course", time: "1d ago" },
  { color: "var(--success)", text: "Completed \"Hello World\"", time: "1d ago" },
  { color: "var(--accent)", text: "Reached Level 2", time: "3d ago" },
];

const LEADERBOARD_DATA = [
  { rank: 1, avatar: "🦊", name: "Maya", xp: 2450 },
  { rank: 2, avatar: "🐺", name: "Kai", xp: 2180 },
  { rank: 3, avatar: "🚀", name: "You", xp: 0, isCurrentUser: true },
  { rank: 4, avatar: "🦉", name: "Sam", xp: 1740 },
  { rank: 5, avatar: "🐱", name: "Zara", xp: 1580 },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 18) return "Good afternoon,";
  return "Good evening,";
}

export function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, user } = useAuth();
  const g = useGamification();
  const [courses, setCourses] = useState<Course[]>([]);
  const [continueTo, setContinueTo] = useState<{
    course: Course;
    slug: string;
    title: string;
    pct: number;
  } | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Onboarding tour
  useEffect(() => {
    if (isLoggedIn && !localStorage.getItem("cyberstars_toured")) {
      setTourStep(0);
    }
  }, [isLoggedIn]);

  // Data fetching
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCurriculum();
        if (cancelled) return;
        setCourses(data);

        if (isLoggedIn) {
          for (const c of data) {
            try {
              const p = await progressService.getCourseProgress(c.key);
              const next = p.lessons.find((l) => !l.completed);
              if (next) {
                const done = p.lessons.filter((l) => l.completed).length;
                const pct = p.lessons.length > 0 ? Math.round((done / p.lessons.length) * 100) : 0;
                if (!cancelled) setContinueTo({ course: c, slug: next.slug, title: next.title, pct });
                return;
              }
            } catch {}
          }
          const first = data[0];
          if (first && first.lessons[0]) {
            setContinueTo({ course: first, slug: first.lessons[0].slug, title: first.lessons[0].title, pct: 0 });
          }
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  function closeTour() {
    localStorage.setItem("cyberstars_toured", "1");
    setTourStep(null);
  }

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

  if (isLoggedIn && user) {
    const leaderboard = LEADERBOARD_DATA.map((entry) =>
      entry.isCurrentUser ? { ...entry, name: user.name || "You", xp: g.xp } : entry
    );

    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Topbar streak={g.streak} />

        <main className="flex-1 px-4 sm:px-6 py-8">
          <div className="max-w-[1040px] mx-auto space-y-6">

            {/* ── Welcome Hero ── */}
            <div
              className="p-6 sm:p-8 rounded-[14px] border border-[var(--border)]"
              style={{ background: "linear-gradient(135deg, var(--bg3) 0%, #1a1040 100%)" }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <p className="text-[var(--text2)] text-sm mb-1">{getGreeting()}</p>
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-[-0.5px] mb-2">
                    Welcome back, {user.name}
                  </h1>
                  <p className="text-[var(--text2)] text-sm">
                    {g.streak > 0
                      ? `You're on a ${g.streak}-day streak — keep it going!`
                      : "Start a lesson today to begin your streak!"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <StatCard label="Total XP" value={String(g.xp)} color="var(--accent)" />
                  <StatCard label="Day Streak" value={`${g.streak}`} color="var(--warning)" />
                  <StatCard label="Level" value={String(g.level)} color="var(--success)" />
                </div>
              </div>
            </div>

            {/* ── XP Mini-Bar ── */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text2)] whitespace-nowrap">
                ⭐ Level {g.level} — {g.xpInLevel} / {g.xpForNextLevel} XP to next
              </span>
              <div className="w-full max-w-[260px] h-1.5 bg-[var(--bg3)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${g.xpForNextLevel > 0 ? (g.xpInLevel / g.xpForNextLevel) * 100 : 0}%`,
                    background: "linear-gradient(90deg, var(--accent), #a855f7)",
                  }}
                />
              </div>
            </div>

            {/* ── Continue Learning ── */}
            {continueTo && (
              <section>
                <SectionHeader>Continue Learning</SectionHeader>
                <button
                  onClick={() => navigate(`/lesson/${continueTo.course.key}/${continueTo.slug}`)}
                  className="w-full text-left flex items-center gap-4 p-4 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] hover:border-[var(--accent)] transition cursor-pointer group"
                >
                  {/* Left accent stripe */}
                  <div className="w-1 self-stretch rounded-full bg-[var(--accent)] shrink-0" />
                  {/* Icon */}
                  <div
                    className="w-[52px] h-[52px] rounded-[10px] flex items-center justify-center text-2xl shrink-0"
                    style={{ background: "var(--bg3)" }}
                  >
                    {COURSE_ICON[continueTo.course.key] ?? "📘"}
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[1px] rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                        {continueTo.course.title}
                      </span>
                    </div>
                    <div className="font-bold text-[15px] truncate">{continueTo.title}</div>
                    <div className="text-[var(--text3)] text-xs mt-0.5 truncate">
                      {COURSE_DESC[continueTo.course.key] ?? ""}
                    </div>
                  </div>
                  {/* Right side: progress + button */}
                  <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs font-semibold text-[var(--text2)]">{continueTo.pct}%</span>
                    <div className="w-20 h-1 bg-[var(--bg3)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-500"
                        style={{ width: `${continueTo.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[var(--accent)] group-hover:translate-x-0.5 transition-transform">
                      Continue →
                    </span>
                  </div>
                </button>
              </section>
            )}

            {/* ── Your Courses ── */}
            <section>
              <SectionHeader>Your Courses</SectionHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((c) => {
                  const p = g.perCourse[c.key];
                  const done = p?.done ?? 0;
                  const total = p?.total ?? c.lessons.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <button
                      key={c.key}
                      onClick={() => {
                        const firstSlug = c.lessons[0]?.slug;
                        if (firstSlug) navigate(`/lesson/${c.key}/${firstSlug}`);
                      }}
                      className="text-left p-5 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] hover:border-[var(--accent)] transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-[8px] flex items-center justify-center text-xl shrink-0"
                          style={{ background: "var(--bg3)" }}
                        >
                          {COURSE_ICON[c.key] ?? "📘"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[15px] group-hover:text-[var(--accent)] transition truncate">
                            {c.title}
                          </div>
                          <div className="text-[11px] text-[var(--text3)]">
                            {total} lesson{total !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text2)] mb-4 line-clamp-2">
                        {COURSE_DESC[c.key] ?? c.description}
                      </p>
                      {pct > 0 ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-[var(--text3)] font-semibold uppercase tracking-[1px]">
                              {done}/{total} completed
                            </span>
                            <span className="text-[10px] text-[var(--text3)] font-semibold">{pct}%</span>
                          </div>
                          <div className="h-1 bg-[var(--bg3)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--success)] rounded-full transition-[width] duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-[var(--accent)]">Start Course →</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Bottom Row: Activity + Leaderboard ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Activity */}
              <div className="p-5 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)]">
                <h3 className="text-xs font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-4">
                  Recent Activity
                </h3>
                <ul className="space-y-3">
                  {ACTIVITY_DATA.map((a, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: a.color }}
                      />
                      <span className="flex-1 text-[var(--text)]">{a.text}</span>
                      <span className="text-[var(--text3)] text-xs whitespace-nowrap">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Leaderboard */}
              <div className="p-5 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)]">
                <h3 className="text-xs font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-4">
                  Leaderboard
                </h3>
                <ul className="space-y-2">
                  {leaderboard.map((entry) => (
                    <li
                      key={entry.rank}
                      className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm ${
                        entry.isCurrentUser
                          ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                          : ""
                      }`}
                    >
                      <span className="w-5 text-[var(--text3)] text-xs font-semibold">#{entry.rank}</span>
                      <span className="text-lg">{entry.avatar}</span>
                      <span className="flex-1 font-medium">{entry.name}</span>
                      <span className="text-xs text-[var(--text2)] font-semibold">{entry.xp} XP</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </main>

        {/* ── Onboarding Tour Modal ── */}
        {tourStep !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-[var(--bg2)] border border-[var(--border)] rounded-[14px] p-8 text-center">
              <div className="text-5xl mb-4">{TOUR_STEPS[tourStep].icon}</div>
              <h2 className="text-xl font-bold mb-2">{TOUR_STEPS[tourStep].title}</h2>
              <p className="text-[var(--text2)] text-sm mb-6">{TOUR_STEPS[tourStep].body}</p>
              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {TOUR_STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition ${
                      i === tourStep ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={closeTour}
                  className="px-4 py-2 text-sm text-[var(--text2)] hover:text-[var(--text)] transition cursor-pointer"
                >
                  Skip
                </button>
                <button
                  onClick={() => {
                    if (tourStep < TOUR_STEPS.length - 1) {
                      setTourStep(tourStep + 1);
                    } else {
                      closeTour();
                    }
                  }}
                  className="px-5 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
                >
                  {tourStep < TOUR_STEPS.length - 1 ? "Next" : "Get Started"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Logged-out marketing view ──
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Topbar streak={g.streak} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full text-center">
          <div
            className="inline-block text-6xl mb-6"
            style={{ filter: "drop-shadow(0 0 24px var(--accent-glow))" }}
          >
            ⬡
          </div>

          <h1 className="text-[44px] font-bold tracking-[-0.5px] mb-3">
            Learn to code, for free
          </h1>
          <p className="text-[var(--text2)] text-lg mb-10">
            Interactive lessons in <span className="text-[var(--text)] font-semibold">Python</span>,{" "}
            <span className="text-[var(--text)] font-semibold">Java</span>, and{" "}
            <span className="text-[var(--text)] font-semibold">C</span>. Read, write, run — all in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <button
              onClick={() => navigate("/curriculum")}
              className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
            >
              Start Learning →
            </button>
            <button
              onClick={() => navigate("/getstarted")}
              className="px-6 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer"
            >
              Sign in
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-3xl mx-auto text-left">
            <div className="p-5 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)]">
              <div className="text-2xl mb-2">📖</div>
              <div className="font-semibold mb-1">Read</div>
              <div className="text-sm text-[var(--text2)]">Bite-sized lessons explained simply</div>
            </div>
            <div className="p-5 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)]">
              <div className="text-2xl mb-2">⌨️</div>
              <div className="font-semibold mb-1">Write</div>
              <div className="text-sm text-[var(--text2)]">Interactive editor right in the browser</div>
            </div>
            <div className="p-5 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)]">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold mb-1">Run</div>
              <div className="text-sm text-[var(--text2)]">Real code execution with instant feedback</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Helper Components ── */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
      {children}
    </h2>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="px-5 py-4 rounded-[10px] border border-[var(--border)] text-center min-w-[100px] backdrop-blur-sm bg-[var(--bg)]/80"
    >
      <div className="text-xl font-bold mb-0.5" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-[1px] text-[var(--text3)] font-semibold">{label}</div>
    </div>
  );
}
