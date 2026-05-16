import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { XPBar } from "../components/gamification/XPBar";
import { Badge } from "../components/gamification/Badge";
import { StreakWidget } from "../components/gamification/StreakWidget";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { courseMeta, courseTitle } from "../constants/courses";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading } = useAuth();
  const g = useGamification();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate("/getstarted");
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex flex-col bg-transparent">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const courseEntries = Object.entries(g.perCourse);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar streak={g.streak} />
      <XPBar current={g.xpInLevel} max={g.xpForNextLevel} level={g.level} />

      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[520px]">
          {/* Header */}
          <div className="flex items-center gap-5 pb-5 border-b border-[var(--border)]">
            <div
              className="w-16 h-16 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[32px] border-[3px] border-[var(--accent)] flex-shrink-0"
            >
              🚀
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-bold tracking-[-0.3px]">{user.name}</h1>
              <p className="text-[12px] text-[var(--text3)] mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-3 border-b border-[var(--border)]">
            <div className="py-4 text-center">
              <div className="text-[24px] font-bold">{g.xp}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">Total XP</div>
            </div>
            <div className="py-4 text-center border-x border-[var(--border)]">
              <div className="text-[24px] font-bold">{g.streak}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">Day Streak</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-[24px] font-bold">{g.badges.filter(b => b.earned).length}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">Badges</div>
            </div>
          </div>

          {/* XP section */}
          <div className="py-4 border-b border-[var(--border)]">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-[var(--warning)] font-semibold">⭐ Level {g.level}</span>
              <span className="text-[var(--text3)]">{g.xpInLevel} / {g.xpForNextLevel} XP</span>
            </div>
            <div className="h-1.5 bg-[var(--bg3)] rounded-[3px] overflow-hidden">
              <div
                className="h-full rounded-[3px] transition-[width] duration-700"
                style={{
                  width: `${Math.min(100, (g.xpInLevel / g.xpForNextLevel) * 100)}%`,
                  background: "linear-gradient(90deg, var(--accent), #a855f7)",
                }}
              />
            </div>
            <div className="mt-3 flex justify-center">
              <StreakWidget days={g.streak} />
            </div>
          </div>

          {/* Courses */}
          <div className="py-5 border-b border-[var(--border)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3.5">
              Courses
            </h2>
            <div className="flex flex-col gap-2.5">
              {courseEntries.map(([key, { done, total }]) => {
                const pct = total > 0 ? (done / total) * 100 : 0;
                const color = courseMeta(key).color;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 bg-[var(--surface)] rounded-[var(--radius-sm)] border border-[var(--border)]"
                  >
                    <span className="text-xl">{courseMeta(key).icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold">{courseTitle(key)}</div>
                      <div className="text-[11px] text-[var(--text3)] mt-0.5">
                        {done} / {total} lessons
                      </div>
                      <div className="h-1 bg-[var(--bg3)] rounded-[2px] mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-[2px] transition-[width] duration-500"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          <div className="py-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3.5">
              Badges
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5">
              {g.badges.map((b) => (
                <Badge key={b.label} icon={b.icon} label={b.label} earned={b.earned} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
