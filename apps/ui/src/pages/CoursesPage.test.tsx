import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ isLoggedIn: false, isLoading: false })),
}));
vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: vi.fn(),
}));
vi.mock('../context/ProgressContext', () => ({
  useAllProgress: vi.fn(() => ({ progressMap: {}, failedCourses: new Set(), isLoading: false })),
}));
vi.mock('../hooks/useGamification', () => ({
  useGamification: vi.fn(() => ({
    totalCompleted: 0,
    totalLessons: 0,
    badges: [],
    perCourse: {},
    isLoading: false,
    refresh: vi.fn(),
  })),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));

const { useCurriculum } = await import('../context/CurriculumContext');
const mockUseCurriculum = vi.mocked(useCurriculum);

const { useAuth } = await import('../context/AuthContext');
const mockUseAuth = vi.mocked(useAuth);

const { useAllProgress } = await import('../context/ProgressContext');
const mockUseAllProgress = vi.mocked(useAllProgress);

const { CoursesPage } = await import('./CoursesPage');

function renderPage(path = '/courses') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:course" element={<CoursesPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const pythonCourse = {
  key: 'python',
  title: 'Python',
  description: 'Learn Python',
  lessons: [
    { slug: 'intro', title: 'Intro', sortOrder: 1 },
    { slug: 'booleans', title: 'Booleans', sortOrder: 2 },
  ],
};

const javaCourse = {
  key: 'java',
  title: 'Java',
  description: 'Learn Java',
  lessons: [{ slug: 'intro', title: 'Intro', sortOrder: 1 }],
};

const treesCourse = {
  key: 'trees-graphs',
  title: 'Trees and Graphs',
  description: 'Trees and graphs in any language',
  lessons: [{ slug: 'trees', title: 'Trees', sortOrder: 1 }],
};

describe('CoursesPage', () => {
  it('labels a multi-language course with its languages and as Beta, card and syllabus', () => {
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse, treesCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getByText('Python · Java · C')).toBeInTheDocument();
    expect(screen.getAllByText('Beta')).toHaveLength(1);
    expect(screen.getByText('Beta')).toHaveAttribute(
      'title',
      'Still being built: more lessons are on the way',
    );

    renderPage('/courses/trees-graphs');
    expect(screen.getAllByText('Beta')).toHaveLength(3);
  });

  it('shows loading state when curriculum is loading', () => {
    mockUseCurriculum.mockReturnValue({ courses: [], isLoading: true, refresh: vi.fn() });
    renderPage();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('shows loading state when logged in and progress is loading', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    mockUseCurriculum.mockReturnValue({ courses: [], isLoading: false, refresh: vi.fn() });
    mockUseAllProgress.mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: true,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('renders course cards when loaded', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse, javaCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getByText('Python')).toBeDefined();
    expect(screen.getByText('Java')).toBeDefined();
  });

  it('shows View Syllabus button when no progress', () => {
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getAllByText(/View Syllabus/).length).toBeGreaterThan(0);
  });

  it('shows Continue button and progress bar when progress > 0', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {
        python: {
          courseKey: 'python',
          earnedXp: 0,
          totalXp: 0,
          completed: 1,
          total: 2,

          lessons: [
            {
              slug: 'intro',
              title: 'Intro',
              completed: true,
              completedAt: null,
              lastAccessedAt: null,
            },
            {
              slug: 'booleans',
              title: 'Booleans',
              completed: false,
              completedAt: null,
              lastAccessedAt: null,
            },
          ],
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getByText('Continue')).toBeDefined();
    expect(screen.getByText('50% complete')).toBeDefined();
  });

  it('Continue button navigates to the most recently accessed lesson', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {
        python: {
          courseKey: 'python',
          earnedXp: 0,
          totalXp: 0,
          completed: 1,
          total: 2,

          lessons: [
            {
              slug: 'intro',
              title: 'Intro',
              completed: true,
              completedAt: null,
              lastAccessedAt: '2026-07-01T10:00:00.000Z',
            },
            {
              slug: 'booleans',
              title: 'Booleans',
              completed: false,
              completedAt: null,
              lastAccessedAt: '2026-07-02T10:00:00.000Z',
            },
          ],
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    fireEvent.click(screen.getByText('Continue'));
    expect(mockNavigate).toHaveBeenCalledWith('/lesson/python/booleans');
  });

  it('Continue button falls back to the first incomplete lesson when nothing was accessed', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {
        python: {
          courseKey: 'python',
          earnedXp: 0,
          totalXp: 0,
          completed: 1,
          total: 2,

          lessons: [
            {
              slug: 'intro',
              title: 'Intro',
              completed: true,
              completedAt: null,
              lastAccessedAt: null,
            },
            {
              slug: 'booleans',
              title: 'Booleans',
              completed: false,
              completedAt: null,
              lastAccessedAt: null,
            },
          ],
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    fireEvent.click(screen.getByText('Continue'));
    expect(mockNavigate).toHaveBeenCalledWith('/lesson/python/booleans');
  });

  it('clicking a course card opens its page', () => {
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    fireEvent.click(screen.getByText('Python'));
    expect(mockNavigate).toHaveBeenCalledWith('/courses/python');
  });

  it("a course's page shows its syllabus", () => {
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage('/courses/python');
    expect(screen.getByText('Chapters')).toBeDefined();
    expect(screen.getByText('Intro')).toBeDefined();
    expect(screen.getByText('Booleans')).toBeDefined();
  });

  it('the old ?open= address shows the course on its own page', () => {
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage('/courses?open=python');
    expect(screen.getByText('Chapters')).toBeDefined();
  });

  it('the View Syllabus button opens the course page', () => {
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    fireEvent.click(screen.getByText('View Syllabus →'));
    expect(mockNavigate).toHaveBeenCalledWith('/courses/python');
  });

  it('closing the syllabus goes back to the course list', () => {
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage('/courses/python');
    fireEvent.click(screen.getByText('×'));
    expect(mockNavigate).toHaveBeenCalledWith('/courses');
  });

  it('each chapter in the syllabus is a link to its lesson', () => {
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {},
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage('/courses/python');
    expect(screen.getByText('Booleans').closest('a')?.getAttribute('href')).toBe(
      '/lesson/python/booleans',
    );
  });

  it('shows checkmark for completed chapters', () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {
        python: {
          courseKey: 'python',
          earnedXp: 0,
          totalXp: 0,
          completed: 1,
          total: 2,

          lessons: [
            {
              slug: 'intro',
              title: 'Intro',
              completed: true,
              completedAt: null,
              lastAccessedAt: null,
            },
            {
              slug: 'booleans',
              title: 'Booleans',
              completed: false,
              completedAt: null,
              lastAccessedAt: null,
            },
          ],
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage('/courses/python');
    expect(screen.getByText('✓')).toBeDefined();
  });
});
