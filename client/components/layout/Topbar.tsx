import { useState, useRef, useEffect } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-transparent border border-transparent hover:border-[var(--border)] hover:bg-[var(--surface)] transition cursor-pointer"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div
                className="w-8 h-8 rounded-full bg-[var(--surface2)] flex items-center justify-center text-base border-2 border-[var(--accent)]"
                title={user.name}
              >
                🚀
              </div>
              <span className="text-[13px] font-semibold">{user.name}</span>
              <span className={`text-[10px] text-[var(--text3)] transition-transform ${menuOpen ? "rotate-180" : ""}`}>▼</span>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] shadow-[0_8px_32px_#0008] overflow-hidden z-50 fade-in-up"
              >
                <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface2)] flex items-center justify-center text-lg border-2 border-[var(--accent)] flex-shrink-0">
                    🚀
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--text)] truncate">{user.name}</div>
                    <div className="text-[11px] text-[var(--text3)] truncate">{user.email}</div>
                  </div>
                </div>
                <button
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer flex items-center gap-2 bg-transparent border-none"
                >
                  <span className="w-4 text-center">👤</span> Profile
                </button>
                <button
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); navigate("/curriculum"); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer flex items-center gap-2 bg-transparent border-none"
                >
                  <span className="w-4 text-center">📚</span> My courses
                </button>
                <div className="border-t border-[var(--border)]" />
                <button
                  role="menuitem"
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                    navigate("/getstarted");
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[var(--error)] hover:bg-[var(--surface)] transition cursor-pointer flex items-center gap-2 bg-transparent border-none"
                >
                  <span className="w-4 text-center">↪</span> Sign out
                </button>
              </div>
            )}
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
