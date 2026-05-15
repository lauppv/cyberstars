import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
  breadcrumb?: { course?: string; lesson?: string };
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  streak?: number;
}

const NAV_ITEMS = [
  { label: "Dashboard", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Algorithms", path: "/algorithms" },
];

export function Topbar({
  breadcrumb,
  showSidebarToggle,
  sidebarOpen,
  onSidebarToggle,
  streak = 0,
}: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
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
    <header className="flex items-center justify-between px-7 h-14 bg-[var(--bg2)] border-b border-[var(--border)] flex-shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-6">
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
            className="text-[22px] text-[var(--accent)]"
            style={{ filter: "drop-shadow(0 0 8px var(--accent-glow))" }}
          >
            ⬡
          </span>
          <span className="font-bold text-[17px]" style={{ letterSpacing: "-0.5px" }}>
            CyberStars
          </span>
        </div>

        {breadcrumb ? (
          <div className="flex items-center gap-2 text-[13px] text-[var(--text3)]">
            {breadcrumb.course && <span className="text-[var(--text2)] hover:text-[var(--accent)] cursor-pointer transition" onClick={() => navigate("/courses")}>{breadcrumb.course}</span>}
            {breadcrumb.course && breadcrumb.lesson && <span className="opacity-40">/</span>}
            {breadcrumb.lesson && <span className="text-[var(--text)]">{breadcrumb.lesson}</span>}
          </div>
        ) : (
          <nav className="flex gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : item.path === "/algorithms"
                    ? location.pathname.startsWith("/algorithms") || location.pathname.startsWith("/lesson/algo")
                    : location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-3.5 py-[7px] rounded-[var(--radius-sm)] text-[13px] font-medium cursor-pointer border-none transition-all ${
                    isActive
                      ? "text-[var(--accent)] bg-[rgba(108,92,231,0.07)]"
                      : "text-[var(--text3)] bg-transparent hover:text-[var(--text)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn && user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-2 py-1 rounded-[var(--radius-sm)] bg-transparent border-none hover:bg-[var(--surface)] transition cursor-pointer"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div className="w-[30px] h-[30px] rounded-full bg-[var(--surface2)] flex items-center justify-center text-sm border-2 border-[var(--accent)]">
                🚀
              </div>
              <span className="text-[13px] font-semibold text-[var(--text)]">{user.name}</span>
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
                  onClick={() => { setMenuOpen(false); navigate("/courses"); }}
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
