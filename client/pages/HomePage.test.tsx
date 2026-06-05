import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { fetchAlmanacSlugs } from '../services/almanacService';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: vi.fn(() => ({ courses: [], isLoading: false })),
}));
vi.mock('../context/ProgressContext', () => ({
  useAllProgress: vi.fn(() => ({
    progressMap: {},
    failedCourses: new Set(),
    isLoading: false,
    refresh: vi.fn(),
  })),
}));
vi.mock('../hooks/useGamification', () => ({
  useGamification: vi.fn(() => ({
    totalCompleted: 10,
    totalLessons: 50,
    badges: [],
    perCourse: {},
    isLoading: false,
    refresh: vi.fn(),
  })),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../components/ui/LoadingSpinner', () => ({
  LoadingSpinner: () => <div>Loading...</div>,
}));
vi.mock('../services/almanacService', () => ({
  fetchAlmanacSlugs: vi.fn(() => Promise.resolve(['a', 'b', 'c', 'd'])),
  fetchAlmanacArticle: vi.fn((slug: string) =>
    Promise.resolve({
      slug,
      cat: 'oss',
      tag: 'OSS',
      title: `Story ${slug}`,
      excerpt: 'excerpt',
      fullText: 'body',
      author: 'x',
      readTime: '5 min',
      emoji: '🐧',
    }),
  ),
}));

const { useAuth } = await import('../context/AuthContext');
const mockUseAuth = vi.mocked(useAuth);

const { useCurriculum } = await import('../context/CurriculumContext');
const mockUseCurriculum = vi.mocked(useCurriculum);

const { useAllProgress } = await import('../context/ProgressContext');
const mockUseAllProgress = vi.mocked(useAllProgress);

const { HomePage } = await import('./HomePage');

const loggedInAuth = {
  isLoggedIn: true,
  isLoading: false,
  user: {
    id: 1,
    name: 'Alice',
    email: 'a@t.com',
    role: 'USER' as const,
    avatarUrl: null,
    bio: null,
    status: null,
    statusExpiresAt: null,
  },
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
  key: 'python',
  title: 'Python',
  description: 'Learn Python',
  lessons: [
    { slug: 'intro', title: 'Intro', sortOrder: 1 },
    { slug: 'booleans', title: 'Booleans', sortOrder: 2 },
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
  mockUseAllProgress.mockReturnValue({
    progressMap: {},
    failedCourses: new Set(),
    isLoading: false,
    refresh: vi.fn(),
  });
  mockUseCurriculum.mockReturnValue({ courses: [], isLoading: false, refresh: vi.fn() });
});

describe('HomePage', () => {
  it('shows loading spinner while auth is loading', () => {
    mockUseAuth.mockReturnValue({ ...loggedOutAuth, isLoading: true });
    renderPage();
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('renders marketing view when logged out', () => {
    mockUseAuth.mockReturnValue(loggedOutAuth);
    renderPage();
    expect(screen.getByText('Learn to code, for free')).toBeDefined();
    expect(screen.getByText('Start Learning →')).toBeDefined();
    expect(screen.getByText('Sign in')).toBeDefined();
  });

  it('renders feature cards in marketing view', () => {
    mockUseAuth.mockReturnValue(loggedOutAuth);
    renderPage();
    expect(screen.getByText('Read')).toBeDefined();
    expect(screen.getByText('Write')).toBeDefined();
    expect(screen.getByText('Run')).toBeDefined();
  });

  it('Start Learning button navigates to /courses', () => {
    mockUseAuth.mockReturnValue(loggedOutAuth);
    renderPage();
    fireEvent.click(screen.getByText('Start Learning →'));
    expect(mockNavigate).toHaveBeenCalledWith('/courses');
  });

  it('Sign in button navigates to /getstarted', () => {
    mockUseAuth.mockReturnValue(loggedOutAuth);
    renderPage();
    fireEvent.click(screen.getByText('Sign in'));
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });

  it('renders dashboard when logged in', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByTestId('topbar')).toBeDefined();
  });

  it('shows continue where you left off section', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
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
              lastAccessedAt: '2025-01-01T00:00:00Z',
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
    expect(screen.getByText('Continue where you left off')).toBeDefined();
    expect(screen.getAllByText('Intro').length).toBeGreaterThanOrEqual(1);
  });

  it('continue section navigates on click', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {
        python: {
          courseKey: 'python',
          completed: 0,
          total: 2,
          lessons: [
            {
              slug: 'intro',
              title: 'Intro',
              completed: false,
              completedAt: null,
              lastAccessedAt: '2025-01-01T00:00:00Z',
            },
          ],
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    fireEvent.click(
      screen.getByText('Continue where you left off').closest('div')!.querySelector('button')!,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/lesson/python/intro');
  });

  it('shows activity heatmap when logged in', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText('Activity')).toBeDefined();
  });

  it('shows almanac highlights when logged in', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText('From the Almanac')).toBeDefined();
  });

  it('renders almanac highlight cards after fetch', async () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(await screen.findAllByText(/^Story /)).toHaveLength(3);
  });

  it('opens story modal when an almanac highlight is clicked', async () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    const cards = await screen.findAllByText(/^Story /);
    fireEvent.click(cards[0].closest('button')!);
    expect(await screen.findByText('✕')).toBeInTheDocument();
  });

  it('hides the almanac section when highlights fail to load', async () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    vi.mocked(fetchAlmanacSlugs).mockRejectedValueOnce(new Error('boom'));
    renderPage();
    await waitFor(() => expect(screen.queryByText('From the Almanac')).not.toBeInTheDocument());
  });

  it('shows course milestones when logged in', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    renderPage();
    expect(screen.getByText('Course Milestones')).toBeDefined();
  });

  it('milestone button for in-progress courses navigates to /courses?open=', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
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
              completedAt: '2025-01-01T00:00:00Z',
              lastAccessedAt: '2025-01-01T00:00:00Z',
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
    const section = screen.getByText('Course Milestones').closest('div')!.parentElement!;
    const btn = section.querySelector('button')!;
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/courses?open=python');
  });

  it('milestone button for not-started courses navigates to /courses?open=', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    const cCourse = {
      key: 'c',
      title: 'C',
      description: 'Learn C',
      lessons: [{ slug: 'hello', title: 'Hello', sortOrder: 1 }],
    };
    mockUseCurriculum.mockReturnValue({
      courses: [pythonCourse, cCourse],
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
              completedAt: '2025-01-01T00:00:00Z',
              lastAccessedAt: '2025-01-01T00:00:00Z',
            },
          ],
        },
        c: {
          courseKey: 'c',
          completed: 0,
          total: 1,
          lessons: [
            {
              slug: 'hello',
              title: 'Hello',
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
    const section = screen.getByText('Course Milestones').closest('div')!.parentElement!;
    const buttons = section.querySelectorAll('button');
    // Last button is the not-started course (rendered after active)
    fireEvent.click(buttons[buttons.length - 1]);
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/courses\?open=/));
  });

  it('renders heatmap activity for dates with multiple completions (countToLevel high branch)', () => {
    mockUseAuth.mockReturnValue(loggedInAuth);
    // 4+ completions on the same day push countToLevel into its `return 3` branch
    const sameDay = new Date().toISOString();
    mockUseCurriculum.mockReturnValue({
      courses: [
        {
          key: 'python',
          title: 'Python',
          description: 'Learn Python',
          lessons: Array.from({ length: 5 }, (_, i) => ({
            slug: `l${i}`,
            title: `L${i}`,
            sortOrder: i,
          })),
        },
      ],
      isLoading: false,
      refresh: vi.fn(),
    });
    mockUseAllProgress.mockReturnValue({
      progressMap: {
        python: {
          courseKey: 'python',
          completed: 5,
          total: 5,
          lessons: Array.from({ length: 5 }, (_, i) => ({
            slug: `l${i}`,
            title: `L${i}`,
            completed: true,
            completedAt: sameDay,
            lastAccessedAt: sameDay,
          })),
        },
      },
      failedCourses: new Set(),
      isLoading: false,
      refresh: vi.fn(),
    });
    renderPage();
    expect(screen.getByText('Activity')).toBeDefined();
  });
});
