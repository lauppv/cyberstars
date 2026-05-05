import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { XPBar } from "../components/gamification/XPBar";
import { Badge } from "../components/gamification/Badge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const COURSE_LABEL: Record<string, string> = {
  python: "Python",
  java: "Java",
  c: "C",
  algo: "Algorithms",
};
const COURSE_ICON: Record<string, string> = {
  python: "🐍",
  java: "☕",
  c: "⚙️",
  algo: "🧩",
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading } = useAuth();
  const g = useGamification();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate("/getstarted");
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex flex-col bg-[var(--bg)]">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const courseEntries = Object.entries(g.perCourse);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Topbar streak={g.streak} />

      <XPBar current={g.xpInLevel} max={g.xpForNextLevel} level={g.level} />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <section className="flex items-center gap-5 mb-10">
            <div
              className="w-20 h-20 rounded-full bg-[var(--surface2)] flex items-center justify-center text-4xl border-2 border-[var(--accent)]"
              style={{ boxShadow: "0 0 24px var(--accent-glow)" }}
            >
              🚀
            </div>
            <div>
              <h1 className="text-[32px] font-bold tracking-[-0.5px]">{user.name}</h1>
              <p className="text-[var(--text2)] text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 text-[12px]">
                <span className="px-2 py-0.5 rounded-full bg-[var(--warning)]/15 text-[var(--warning)] font-semibold">
                  ⭐ Level {g.level}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] font-semibold">
                  {g.xp} XP
                </span>
              </div>
            </div>
          </section>

          {/* Stat cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Lessons completed" value={`${g.totalCompleted} / ${g.totalLessons}`} icon="✅" />
            <StatCard label="Current level" value={`Level ${g.level}`} icon="⭐" />
            <StatCard label="Total XP" value={String(g.xp)} icon="✨" />
            <StatCard label="Day streak" value={`${g.streak}`} icon="🔥" />
          </section>

          {/* Per-course progress */}
          <section className="mb-10">
            <h2 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
              Course progress
            </h2>
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] divide-y divide-[var(--border)]">
              {courseEntries.length === 0 && (
                <div className="px-5 py-4 text-[var(--text3)] text-sm">No courses yet.</div>
              )}
              {courseEntries.map(([key, { done, total }]) => {
                const pct = total > 0 ? (done / total) * 100 : 0;
                return (
                  <div key={key} className="px-5 py-4 flex items-center gap-4">
                    <span className="text-2xl">{COURSE_ICON[key] ?? "📘"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-[13px] mb-1.5">
                        <span className="font-semibold text-[var(--text)]">
                          {COURSE_LABEL[key] ?? key}
                        </span>
                        <span className="text-[var(--text3)]">
                          {done} / {total} · {Math.round(pct)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg3)] rounded-[3px] overflow-hidden">
                        <div
                          className="h-full bg-[var(--success)] rounded-[3px] transition-[width] duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3">
              Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {g.badges.map((b) => (
                <Badge key={b.label} icon={b.icon} label={b.label} earned={b.earned} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] p-4">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] font-semibold mb-0.5">
        {label}
      </div>
      <div className="text-[18px] font-bold text-[var(--text)]">{value}</div>
    </div>
  );
}
