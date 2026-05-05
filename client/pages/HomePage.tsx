import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { XPBar } from "../components/gamification/XPBar";
import { Badge } from "../components/gamification/Badge";
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

export function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, user } = useAuth();
  const g = useGamification();
  const [courses, setCourses] = useState<Course[]>([]);
  const [continueTo, setContinueTo] = useState<{ course: Course; slug: string; title: string } | null>(null);

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
                if (!cancelled) setContinueTo({ course: c, slug: next.slug, title: next.title });
                return;
              }
            } catch {}
          }
          const first = data[0];
          if (first && first.lessons[0]) {
            setContinueTo({ course: first, slug: first.lessons[0].slug, title: first.lessons[0].title });
          }
        }
      } catch {}
    })();
    return () => { cancelled = true; };
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

  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Topbar streak={g.streak} />
        <XPBar current={g.xpInLevel} max={g.xpForNextLevel} level={g.level} />

        <main className="flex-1 px-6 py-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-[28px] font-bold tracking-[-0.5px]">Dashboard</h1>
              <p className="text-[var(--text2)] text-sm mt-1">Pick up where you left off.</p>
            </div>

            {/* Continue learning + stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              {continueTo ? (
                <button
                  onClick={() => navigate(`/lesson/${continueTo.course.key}/${continueTo.slug}`)}
                  className="lg:col-span-2 text-left p-6 bg-[var(--bg2)] border border-[var(--accent)]/30 rounded-[var(--radius)] hover:border-[var(--accent)] transition cursor-pointer relative overflow-hidden group"
                  style={{ boxShadow: "0 0 24px var(--accent-glow)" }}
                >
                  <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-2xl"
                    style={{ background: "var(--accent)" }}
                  />
                  <div className="relative">
                    <div className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--accent)] mb-2">
                      Continue learning
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{COURSE_ICON[continueTo.course.key] ?? "📘"}</span>
                      <div>
                        <div className="text-[20px] font-bold">{continueTo.title}</div>
                        <div className="text-[var(--text3)] text-sm">{continueTo.course.title}</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)] group-hover:gap-2 transition-all">
                      Resume lesson →
                    </span>
                  </div>
                </button>
              ) : (
                <div className="lg:col-span-2 p-6 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)]">
                  <div className="text-[var(--text2)]">Loading your progress...</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <MiniStat icon="✅" label="Completed" value={`${g.totalCompleted}/${g.totalLessons}`} />
                <MiniStat icon="⭐" label="Level" value={String(g.level)} />
                <MiniStat icon="✨" label="Total XP" value={String(g.xp)} />
                <MiniStat icon="🔥" label="Streak" value={`${g.streak}d`} />
              </div>
            </div>

            {/* Courses */}
            <h2 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
              Your courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {courses.map((c) => {
                const p = g.perCourse[c.key];
                const done = p?.done ?? 0;
                const total = p?.total ?? c.lessons.length;
                const pct = total > 0 ? (done / total) * 100 : 0;
                return (
                  <button
                    key={c.key}
                    onClick={() => {
                      const firstSlug = c.lessons[0]?.slug;
                      if (firstSlug) navigate(`/lesson/${c.key}/${firstSlug}`);
                    }}
                    className="text-left p-5 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] hover:border-[var(--accent)] transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{COURSE_ICON[c.key] ?? "📘"}</span>
                      <span className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] font-semibold">
                        {done}/{total}
                      </span>
                    </div>
                    <div className="font-bold text-[15px] mb-2 group-hover:text-[var(--accent)] transition">
                      {c.title}
                    </div>
                    <div className="h-1 bg-[var(--bg3)] rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-[var(--success)] transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Badges */}
            <h2 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
              Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {g.badges.map((b) => (
                <Badge key={b.label} icon={b.icon} label={b.label} earned={b.earned} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Logged-out marketing view
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

function MiniStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="p-3 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius-sm)]">
      <div className="text-lg leading-none mb-1">{icon}</div>
      <div className="text-[10px] uppercase tracking-[1px] text-[var(--text3)] font-semibold">
        {label}
      </div>
      <div className="text-[15px] font-bold text-[var(--text)]">{value}</div>
    </div>
  );
}
