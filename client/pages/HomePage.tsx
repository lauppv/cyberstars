import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { StreakWidget } from "../components/gamification/StreakWidget";
import * as progressService from "../services/progressService";
import { useCurriculum } from "../context/CurriculumContext";
import { useAllProgress } from "../context/ProgressContext";
import type { Course } from "../../shared/lesson";
import type { LeaderboardEntry } from "../../shared/progress";
import { courseMeta } from "../constants/courses";
import { MAIN_COURSE_KEYS, TERMINAL_COURSE_KEYS, progressPct } from "../../shared/constants";

const TOUR_STEPS = [
  { icon: "👋", title: "Welcome to CyberStars!", body: "We're excited to have you. Let's take a quick tour of the platform so you know where everything is." },
  { icon: "📚", title: "Choose Your Path", body: "Pick from Python, Java, or C. Each course has structured lessons that build on each other — from basics to advanced topics." },
  { icon: "⌨️", title: "Code as You Learn", body: "Every lesson has a built-in code editor. Read the explanation on the left, then practice on the right — no setup needed." },
  { icon: "🏆", title: "Earn XP & Badges", body: "Complete lessons to earn XP, maintain your daily streak, and unlock badges. Climb the leaderboard and show off your skills!" },
];


const LB_PAGE_SIZE = 5;

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
  const { courses: allCourses } = useCurriculum();
  const { progressMap, refresh: refreshProgress } = useAllProgress();
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbPage, setLbPage] = useState(0);
  const [showAllLb, setShowAllLb] = useState(false);

  const mainCourses = useMemo(
    () => allCourses.filter((c) => (MAIN_COURSE_KEYS as readonly string[]).includes(c.key)),
    [allCourses]
  );

  const allNonAlgoCourses = useMemo(() => {
    const keys = [...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS] as readonly string[];
    return allCourses.filter((c) => keys.includes(c.key));
  }, [allCourses]);

  const continueTo = useMemo(() => {
    if (!isLoggedIn || !allNonAlgoCourses.length) return null;
    let best: { course: Course; slug: string; title: string; pct: number; at: string } | null = null;
    for (const c of allNonAlgoCourses) {
      const p = progressMap[c.key];
      if (!p) continue;
      const pct = progressPct(p.completed, p.total);
      for (const l of p.lessons) {
        if (l.lastAccessedAt && (!best || l.lastAccessedAt > best.at)) {
          best = { course: c, slug: l.slug, title: l.title, pct, at: l.lastAccessedAt };
        }
      }
    }
    if (best) return { course: best.course, slug: best.slug, title: best.title, pct: best.pct };
    const first = allNonAlgoCourses[0];
    if (first?.lessons[0]) return { course: first, slug: first.lessons[0].slug, title: first.lessons[0].title, pct: 0 };
    return null;
  }, [isLoggedIn, allNonAlgoCourses, progressMap]);

  useEffect(() => {
    if (isLoggedIn) refreshProgress();
  }, [isLoggedIn]);

  // Onboarding tour
  useEffect(() => {
    if (isLoggedIn && !localStorage.getItem("cyberstars_toured")) {
      setTourStep(0);
    }
  }, [isLoggedIn]);

  // Leaderboard (only remaining fetch — not progress-related)
  useEffect(() => {
    let cancelled = false;
    progressService.getLeaderboard()
      .then((lb) => { if (!cancelled) setLeaderboard(lb); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  function closeTour() {
    localStorage.setItem("cyberstars_toured", "1");
    setTourStep(null);
  }

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-transparent">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isLoggedIn && user) {
    const lbMaxPage = Math.max(0, Math.ceil(leaderboard.length / LB_PAGE_SIZE) - 1);
    const lbSlice = leaderboard.slice(lbPage * LB_PAGE_SIZE, (lbPage + 1) * LB_PAGE_SIZE);

    return (
      <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
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

            {/* ── XP Mini-Bar + Streak ── */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-0">
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
              <StreakWidget days={g.streak} />
            </div>

            {/* ── Continue Where You Left Off ── */}
            {continueTo && (
              <section>
                <SectionHeader>Continue where you left off</SectionHeader>
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
                    {courseMeta(continueTo.course.key).icon}
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
                      {continueTo.course.description}
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

            {/* ── Leaderboard ── */}
            <div className="p-5 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-[1px] text-[var(--text3)]">
                  Leaderboard
                </h3>
                {leaderboard.length > LB_PAGE_SIZE && (
                  <button
                    onClick={() => setShowAllLb(true)}
                    className="text-[11px] text-[var(--accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Show All
                  </button>
                )}
              </div>
              {leaderboard.length === 0 ? (
                <p className="text-sm text-[var(--text3)]">No entries yet. Complete a lesson to appear here!</p>
              ) : (
                <>
                  <ul className="space-y-2">
                    {lbSlice.map((entry) => (
                      <li
                        key={entry.rank}
                        className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm ${
                          entry.isCurrentUser
                            ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                            : ""
                        }`}
                      >
                        <span className="w-5 text-[var(--text3)] text-xs font-semibold">#{entry.rank}</span>
                        <span className="flex-1 font-medium">{entry.name}{entry.isCurrentUser ? " (you)" : ""}</span>
                        <span className="text-xs text-[var(--text2)] font-semibold">{entry.xp} XP</span>
                      </li>
                    ))}
                  </ul>
                  {lbMaxPage > 0 && (
                    <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-[var(--border)]">
                      <button
                        onClick={() => setLbPage((p) => Math.max(0, p - 1))}
                        disabled={lbPage === 0}
                        className="text-xs text-[var(--text2)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                      >
                        ← Prev
                      </button>
                      <span className="text-[11px] text-[var(--text3)]">{lbPage + 1} / {lbMaxPage + 1}</span>
                      <button
                        onClick={() => setLbPage((p) => Math.min(lbMaxPage, p + 1))}
                        disabled={lbPage === lbMaxPage}
                        className="text-xs text-[var(--text2)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </main>

        {/* ── Leaderboard Full Modal ── */}
        {showAllLb && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowAllLb(false)}>
            <div className="w-full max-w-md max-h-[80vh] bg-[var(--bg2)] border border-[var(--border)] rounded-[14px] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                <h2 className="text-lg font-bold">Leaderboard</h2>
                <button onClick={() => setShowAllLb(false)} className="text-[var(--text3)] hover:text-[var(--text)] text-lg bg-transparent border-none cursor-pointer">×</button>
              </div>
              <ul className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
                {leaderboard.map((entry) => (
                  <li
                    key={entry.rank}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm ${
                      entry.isCurrentUser ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30" : ""
                    }`}
                  >
                    <span className="w-6 text-[var(--text3)] text-xs font-semibold">#{entry.rank}</span>
                    <span className="flex-1 font-medium">{entry.name}{entry.isCurrentUser ? " (you)" : ""}</span>
                    <span className="text-xs text-[var(--text2)] font-semibold">{entry.xp} XP</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

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
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
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
              onClick={() => navigate("/courses")}
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
    <h2 className="text-[11px] font-semibold tracking-[1px] text-[var(--text3)] mb-3">
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
