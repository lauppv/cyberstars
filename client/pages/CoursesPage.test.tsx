import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
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

function renderPage() {
  return render(
    <MemoryRouter>
      <CoursesPage />
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

describe('CoursesPage', () => {
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

  it('Continue button navigates to first lesson', () => {
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
          ],
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    fireEvent.click(screen.getByText('Continue'));
    expect(mockNavigate).toHaveBeenCalledWith('/lesson/python/intro');
  });

  it('clicking a course card opens the syllabus drawer', () => {
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
    expect(screen.getByText('Chapters')).toBeDefined();
    expect(screen.getByText('Intro')).toBeDefined();
    expect(screen.getByText('Booleans')).toBeDefined();
  });

  it('clicking the View Syllabus button opens the drawer without navigating', () => {
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
    expect(screen.getByText('Chapters')).toBeDefined();
  });

  it('closing the syllabus drawer via close button', () => {
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
    expect(screen.getByText('Chapters')).toBeDefined();
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText('Chapters')).toBeNull();
  });

  it('clicking a chapter in syllabus navigates to the lesson', () => {
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
    fireEvent.click(screen.getByText('Booleans'));
    expect(mockNavigate).toHaveBeenCalledWith('/lesson/python/booleans');
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
    fireEvent.click(screen.getByText('Python'));
    expect(screen.getByText('✓')).toBeDefined();
  });
});
