import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { StreakWidget } from "../gamification/StreakWidget";

interface TopbarProps {
  breadcrumb?: { course?: string; lesson?: string };
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  streak?: number;
}

export function Topbar({
  breadcrumb,
  showSidebarToggle,
  sidebarOpen,
  onSidebarToggle,
  streak = 1,
}: TopbarProps) {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-5 h-[52px] bg-[var(--bg2)] border-b border-[var(--border)] flex-shrink-0">
      <div className="flex items-center gap-4">
        {showSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="bg-transparent border border-[var(--border)] text-[var(--text3)] w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-[11px] hover:text-[var(--text)] hover:border-[var(--text3)] transition cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        )}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span
            className="text-xl text-[var(--accent)]"
            style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
          >
            ⬡
          </span>
          <span className="font-bold text-base tracking-[-0.5px]">CyberStars</span>
        </div>
        {breadcrumb && (
          <div className="flex items-center gap-2 text-[13px] text-[var(--text3)] ml-2">
            {breadcrumb.course && <span className="text-[var(--text2)]">{breadcrumb.course}</span>}
            {breadcrumb.course && breadcrumb.lesson && <span className="opacity-40">/</span>}
            {breadcrumb.lesson && <span className="text-[var(--text)]">{breadcrumb.lesson}</span>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        {isLoggedIn && <StreakWidget days={streak} />}

        {isLoggedIn && user ? (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-[var(--surface2)] flex items-center justify-center text-base border-2 border-[var(--accent)]"
              title={user.name}
            >
              🚀
            </div>
            <span className="text-[13px] font-semibold">{user.name}</span>
            <button
              onClick={async () => {
                await logout();
                navigate("/getstarted");
              }}
              className="ml-2 px-3 py-1.5 text-[12px] text-[var(--text3)] hover:text-[var(--error)] transition cursor-pointer bg-transparent border-none"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/getstarted")}
            className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 transition cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
