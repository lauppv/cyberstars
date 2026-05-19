import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("../context/CurriculumContext", () => ({
  useCurriculum: vi.fn(() => ({ courses: [], isLoading: false })),
}));
vi.mock("../context/ProgressContext", () => ({
  useAllProgress: vi.fn(() => ({ progressMap: {}, failedCourses: new Set(), isLoading: false, refresh: vi.fn() })),
}));
vi.mock("../hooks/useGamification", () => ({
  useGamification: vi.fn(() => ({ xp: 150, level: 3, streak: 5, xpInLevel: 50, xpForNextLevel: 100, badges: [] })),
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

const { useCurriculum } = await import("../context/CurriculumContext");
const mockUseCurriculum = vi.mocked(useCurriculum);

const { useAllProgress } = await import("../context/ProgressContext");
const mockUseAllProgress = vi.mocked(useAllProgress);

const progressService = await import("../services/progressService");
const mockGetLeaderboard = vi.mocked(progressService.getLeaderboard);

const { HomePage } = await import("./HomePage");

const loggedInAuth = {
  isLoggedIn: true,
  isLoading: false,
  user: { id: 1, name: "Alice", email: "a@t.com", role: "USER" as const, avatarUrl: null, bio: null, status: null, statusExpiresAt: null },
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
  refreshUser: vi.fn(),
} as ReturnType<typeof useAuth>;

const loggedOutAuth = {
  isLoggedIn: false,
  isLoading: false,
  user: null,
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
  refreshUser: vi.fn(),
} as ReturnType<typeof useAuth>;

const pythonCourse = {
  key: "python",
  title: "Python",
  description: "Learn Python",
  lessons: [
    { slug: "intro", title: "Intro", sortOrder: 1 },
    { slug: "booleans", title: "Booleans", sortOrder: 2 },
  ],
};

function renderPage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetLeaderboard.mockResolvedValue([]);
  mockUseAllProgress.mockReturnValue({ progressMap: {}, failedCourses: new Set(), isLoading: false, refresh: vi.fn() });
  mockUseCurriculum.mockReturnValue({ courses: [], isLoading: false, refresh: vi.fn() });
});

describe("HomePage", () => {
  it("shows loading spinner while auth is loading", () => {
    mockUseAuth.mockReturnValue({ ...loggedOutAuth, isLoading: true });
    renderPage();
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  it("renders marketing view when logged out", () => {
    mockUseAuth.mockReturnValue(loggedOutAuth);
    renderPage();
    expect(screen.getByText("Learn to code, for free")).toBeDefined();
    expect(screen.getByText("Start Learning →")).toBeDefined();
    expect(screen.getByText("Sign in")).toBeDefined();
  });

  it("renders feature cards in marketing view", () => {
    mockUseAuth.mockReturnValue(loggedOutAuth);
    renderPage();
    expect(screen.getByText("Read")).toBeDefined();
    expect(screen.getByText("Write")).toBeDefined();
    expect(screen.getByText("Run")).toBeDefined();
  });

  it("Start Learning button navigates to /courses", () => {
    mockUseAuth.mockReturnValue(loggedOutAuth);
    renderPage();
    fireEvent.click(screen.getByText("Start Learning →"));
    expect(mockNavigate).toHaveBeenCalledWith("/courses");
  });

  it("Sign in button navigates to /getstarted", () => {
    mockUseAuth.mockReturnValue(loggedOutAuth);
    renderPage();
    fireEvent.click(screen.getByText("Sign in"));
    expect(mockNavigate).toHaveBeenCalledWith("/getstarted");
  });

  it("renders welcome back when logged in", () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText(/Welcome back, Alice/)).toBeDefined();
  });

  it("shows stat cards with gamification data", () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText("150")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("Total XP")).toBeDefined();
    expect(screen.getByText("Day Streak")).toBeDefined();
    expect(screen.getByText("Level")).toBeDefined();
  });

  it("shows streak message when streak > 0", () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText(/5-day streak/)).toBeDefined();
  });

  it("shows leaderboard section when logged in", () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText("Leaderboard")).toBeDefined();
  });

  it("shows empty leaderboard message", () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText(/No entries yet/)).toBeDefined();
  });

  it("renders leaderboard entries", async () => {
    mockGetLeaderboard.mockResolvedValue([
      { rank: 1, name: "Bob", xp: 200, isCurrentUser: false },
      { rank: 2, name: "Alice", xp: 150, isCurrentUser: true },
    ]);
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeDefined();
    });
    expect(screen.getByText("Alice (you)")).toBeDefined();
    expect(screen.getByText("#1")).toBeDefined();
    expect(screen.getByText("#2")).toBeDefined();
  });

  it("shows leaderboard pagination when more than 5 entries", async () => {
    const entries = Array.from({ length: 7 }, (_, i) => ({
      rank: i + 1,
      name: `User${i + 1}`,
      xp: 100 - i * 10,
      isCurrentUser: false,
    }));
    mockGetLeaderboard.mockResolvedValue(entries);
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("User1")).toBeDefined();
    });
    expect(screen.getByText("Show All")).toBeDefined();
    expect(screen.getByText("Next →")).toBeDefined();
    fireEvent.click(screen.getByText("Next →"));
    expect(screen.getByText("User6")).toBeDefined();
    fireEvent.click(screen.getByText("← Prev"));
    expect(screen.getByText("User1")).toBeDefined();
  });

  it("opens full leaderboard modal", async () => {
    const entries = Array.from({ length: 7 }, (_, i) => ({
      rank: i + 1,
      name: `Player${i + 1}`,
      xp: 100 - i * 10,
      isCurrentUser: false,
    }));
    mockGetLeaderboard.mockResolvedValue(entries);
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Show All")).toBeDefined();
    });
    fireEvent.click(screen.getByText("Show All"));
    expect(screen.getByText("Player7")).toBeDefined();
  });

  it("shows continue where you left off section", () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    mockUseCurriculum.mockReturnValue({ courses: [pythonCourse], isLoading: false, refresh: vi.fn() });
    mockUseAllProgress.mockReturnValue({
      progressMap: {
        python: {
          courseKey: "python",
          completed: 1,
          total: 2,
          totalXp: 30,
          earnedXp: 10,
          lessons: [
            { slug: "intro", title: "Intro", completed: true, completedAt: null, lastAccessedAt: "2025-01-01T00:00:00Z" },
            { slug: "booleans", title: "Booleans", completed: false, completedAt: null, lastAccessedAt: null },
          ],
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getByText("Continue where you left off")).toBeDefined();
    expect(screen.getByText("Intro")).toBeDefined();
  });

  it("continue section navigates on click", () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    mockUseCurriculum.mockReturnValue({ courses: [pythonCourse], isLoading: false, refresh: vi.fn() });
    mockUseAllProgress.mockReturnValue({
      progressMap: {
        python: {
          courseKey: "python",
          completed: 0,
          total: 2,
          totalXp: 30,
          earnedXp: 0,
          lessons: [
            { slug: "intro", title: "Intro", completed: false, completedAt: null, lastAccessedAt: "2025-01-01T00:00:00Z" },
          ],
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    fireEvent.click(screen.getByText("Continue where you left off").closest("section")!.querySelector("button")!);
    expect(mockNavigate).toHaveBeenCalledWith("/lesson/python/intro");
  });

  it("shows XP level bar", () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText(/Level 3 — 50 \/ 100 XP to next/)).toBeDefined();
  });
});
