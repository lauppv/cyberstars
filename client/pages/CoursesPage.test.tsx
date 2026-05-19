import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(() => ({ isLoggedIn: false, isLoading: false })),
}));
vi.mock("../context/CurriculumContext", () => ({
  useCurriculum: vi.fn(),
}));
vi.mock("../context/ProgressContext", () => ({
  useAllProgress: vi.fn(() => ({ progressMap: {}, isLoading: false })),
}));
vi.mock("../hooks/useGamification", () => ({
  useGamification: vi.fn(() => ({ xp: 0, level: 1, streak: 0, xpInLevel: 0, xpForNextLevel: 100, badges: [] })),
}));
vi.mock("../components/layout/Topbar", () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));

const { useCurriculum } = await import("../context/CurriculumContext");
const mockUseCurriculum = vi.mocked(useCurriculum);

const { CoursesPage } = await import("./CoursesPage");

function renderPage() {
  return render(
    <MemoryRouter>
      <CoursesPage />
    </MemoryRouter>,
  );
}

describe("CoursesPage", () => {
  it("shows loading state when curriculum is loading", () => {
    mockUseCurriculum.mockReturnValue({ courses: [], isLoading: true, refresh: vi.fn() });
    renderPage();
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  it("renders course cards when loaded", () => {
    mockUseCurriculum.mockReturnValue({
      courses: [
        { key: "python", title: "Python", description: "Learn Python", lessons: [{ slug: "intro", title: "Intro", sortOrder: 1 }] },
        { key: "java", title: "Java", description: "Learn Java", lessons: [{ slug: "intro", title: "Intro", sortOrder: 1 }] },
      ],
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getByText("Python")).toBeDefined();
    expect(screen.getByText("Java")).toBeDefined();
  });

  it("shows View Syllabus button on each course card", () => {
    mockUseCurriculum.mockReturnValue({
      courses: [
        { key: "python", title: "Python", description: "Learn Python", lessons: [{ slug: "intro", title: "Intro", sortOrder: 1 }] },
      ],
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getAllByText(/View Syllabus/).length).toBeGreaterThan(0);
  });
});
