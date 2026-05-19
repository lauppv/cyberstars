import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("../context/CurriculumContext", () => ({
  useCurriculum: vi.fn(() => ({ courses: [], isLoading: false })),
}));
vi.mock("../context/ProgressContext", () => ({
  useAllProgress: vi.fn(() => ({ progressMap: {}, isLoading: false, refresh: vi.fn() })),
}));
vi.mock("../hooks/useGamification", () => ({
  useGamification: vi.fn(() => ({ xp: 0, level: 1, streak: 0, xpInLevel: 0, xpForNextLevel: 100, badges: [] })),
}));
vi.mock("../services/progressService", () => ({
  getLeaderboard: vi.fn().mockResolvedValue([]),
}));
vi.mock("../components/layout/Topbar", () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock("../components/ui/LoadingSpinner", () => ({
  LoadingSpinner: () => <div>Loading...</div>,
}));
vi.mock("../components/gamification/StreakWidget", () => ({
  StreakWidget: () => <div>Streak</div>,
}));

const { useAuth } = await import("../context/AuthContext");
const mockUseAuth = vi.mocked(useAuth);

const { HomePage } = await import("./HomePage");

function renderPage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("shows loading spinner while auth is loading", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, isLoading: true, user: null, login: vi.fn(), signup: vi.fn(), logout: vi.fn(), refreshUser: vi.fn() } as ReturnType<typeof useAuth>);
    renderPage();
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  it("renders marketing view when logged out", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, isLoading: false, user: null, login: vi.fn(), signup: vi.fn(), logout: vi.fn(), refreshUser: vi.fn() } as ReturnType<typeof useAuth>);
    renderPage();
    expect(screen.getByText("Learn to code, for free")).toBeDefined();
    expect(screen.getByText("Start Learning →")).toBeDefined();
    expect(screen.getByText("Sign in")).toBeDefined();
  });

  it("renders welcome back when logged in", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true, isLoading: false,
      user: { id: 1, name: "Alice", email: "a@t.com", role: "USER" as const, avatarUrl: null, bio: null, status: null, statusExpiresAt: null },
      login: vi.fn(), signup: vi.fn(), logout: vi.fn(), refreshUser: vi.fn(),
    } as ReturnType<typeof useAuth>);
    renderPage();
    expect(screen.getByText(/Welcome back, Alice/)).toBeDefined();
  });

  it("shows leaderboard section when logged in", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true, isLoading: false,
      user: { id: 1, name: "Alice", email: "a@t.com", role: "USER" as const, avatarUrl: null, bio: null, status: null, statusExpiresAt: null },
      login: vi.fn(), signup: vi.fn(), logout: vi.fn(), refreshUser: vi.fn(),
    } as ReturnType<typeof useAuth>);
    renderPage();
    expect(screen.getByText("Leaderboard")).toBeDefined();
  });
});
