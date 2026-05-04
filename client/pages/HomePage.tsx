import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../hooks/useGamification";
import { Topbar } from "../components/layout/Topbar";
import { Badge } from "../components/gamification/Badge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function HomePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading } = useAuth();
  const gamification = useGamification();

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

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full text-center">
          <div
            className="inline-block text-6xl mb-6"
            style={{ filter: "drop-shadow(0 0 24px var(--accent-glow))" }}
          >
            ⬡
          </div>

          {isLoggedIn && user ? (
            <>
              <h1 className="text-[44px] font-bold tracking-[-0.5px] mb-3">
                Welcome back,{" "}
                <span className="text-[var(--accent)]">{user.name}</span>
              </h1>
              <p className="text-[var(--text2)] text-lg mb-10">
                You're on{" "}
                <span className="text-[var(--warning)] font-semibold">Level {gamification.level}</span>{" "}
                with{" "}
                <span className="text-[var(--accent)] font-semibold">{gamification.xp} XP</span>.{" "}
                Keep going!
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[44px] font-bold tracking-[-0.5px] mb-3">
                Learn to code, for free
              </h1>
              <p className="text-[var(--text2)] text-lg mb-10">
                Interactive lessons in <span className="text-[var(--text)] font-semibold">Python</span>,{" "}
                <span className="text-[var(--text)] font-semibold">Java</span>, and{" "}
                <span className="text-[var(--text)] font-semibold">C</span>. Read, write, run — all in one place.
              </p>
            </>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <button
              onClick={() => navigate("/curriculum")}
              className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
            >
              {isLoggedIn ? "Continue Learning →" : "Start Learning →"}
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => navigate("/getstarted")}
                className="px-6 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer"
              >
                Sign in
              </button>
            )}
          </div>

          {isLoggedIn && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {gamification.badges.map((b) => (
                <Badge key={b.label} icon={b.icon} label={b.label} earned={b.earned} />
              ))}
            </div>
          )}

          {!isLoggedIn && (
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
          )}
        </div>
      </main>
    </div>
  );
}
