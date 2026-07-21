import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { PublicProfile } from '../../shared/profile';

const mockNavigate = vi.fn();
let mockParams: { userId?: string } = { userId: '7' };
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate, useParams: () => mockParams };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: null, isLoading: false })),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../services/userService', () => ({ getPublicProfile: vi.fn() }));
vi.mock('../services/connectionsService', () => ({ sendRequest: vi.fn() }));
const mockOpenWith = vi.fn();
vi.mock('../context/MessagesContext', () => ({
  useMessages: () => ({ openWith: mockOpenWith }),
}));
vi.mock('../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      {
        key: 'python',
        title: 'Python',
        description: '',
        lessons: [
          { slug: 'py-1', title: 'Intro to Python', sortOrder: 1 },
          { slug: 'py-2', title: 'Variables', sortOrder: 2 },
        ],
      },
    ],
    isLoading: false,
    refresh: vi.fn(),
  }),
}));

const { useAuth } = await import('../context/AuthContext');
const mockUseAuth = vi.mocked(useAuth);
const userService = await import('../services/userService');
const mockGetPublicProfile = vi.mocked(userService.getPublicProfile);
const connectionsService = await import('../services/connectionsService');
const mockSendRequest = vi.mocked(connectionsService.sendRequest);

const loggedIn = () =>
  mockUseAuth.mockReturnValue({
    user: { id: 1, role: 'USER' },
    isLoading: false,
  } as unknown as ReturnType<typeof useAuth>);

const { PublicProfilePage } = await import('./PublicProfilePage');

const fullProfile: PublicProfile = {
  userId: 7,
  name: 'Nova',
  avatarUrl: null,
  memberSince: '2025-01-01T00:00:00.000Z',
  isSelf: false,
  status: 'coding',
  bio: 'Exploring the cosmos',
  stats: {
    lessonsDone: 12,
    activeCourses: 2,
    streak: 4,
    courses: [
      { courseKey: 'python', lessons: ['py-2', 'py-1'] },
      { courseKey: 'algo-c', lessons: ['ac-1'] },
    ],
  },
  progress: {
    level: 3,
    totalXp: 250,
    titleKey: 'level.title.3',
    rank: 5,
    badges: 6,
    badgeList: [
      { courseKey: 'python', level: 0 },
      { courseKey: 'python', level: 1 },
      { courseKey: 'algo-c', level: 0 },
    ],
  },
  activity: ['2026-07-15T10:00:00.000Z', '2026-07-15T12:00:00.000Z', '2026-07-16T09:00:00.000Z'],
  connections: { users: [], count: 0 },
  connectionRelation: 'none',
};

function renderPage() {
  return render(
    <MemoryRouter>
      <PublicProfilePage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockParams = { userId: '7' };
  mockUseAuth.mockReturnValue({ user: null, isLoading: false } as ReturnType<typeof useAuth>);
  mockGetPublicProfile.mockResolvedValue(fullProfile);
});

describe('PublicProfilePage', () => {
  it('renders the profile after loading', async () => {
    renderPage();
    expect(await screen.findByText('Nova')).toBeDefined();
    expect(screen.getByText('Exploring the cosmos')).toBeDefined();
    expect(screen.getByText(/coding/)).toBeDefined();
    expect(mockGetPublicProfile).toHaveBeenCalledWith(7);
  });

  it('renders stats and progress cells when present', async () => {
    renderPage();
    await screen.findByText('Nova');
    expect(screen.getByText('Lessons Done')).toBeDefined();
    expect(screen.getByText('Active Courses')).toBeDefined();
    // "Badges" appears twice: the stat cell label and the enumerated section header.
    expect(screen.getAllByText('Badges').length).toBeGreaterThan(0);
    expect(screen.getByText('Day Streak')).toBeDefined();
    expect(screen.getByText('#5')).toBeDefined();
    expect(screen.getByText(/250/)).toBeDefined();
  });

  it('lists completed courses and expands lessons on click, ordered by lesson position', async () => {
    renderPage();
    await screen.findByText('Nova');
    expect(screen.getByText('Completed courses')).toBeDefined();
    // Chips render for both courses; algo-c has no curriculum entry so it uses
    // its derived title.
    const chip = screen.getByText('Python');
    expect(screen.getByText('C Algorithms')).toBeDefined();
    // Lessons are hidden until the chip is expanded.
    expect(screen.queryByText('Intro to Python')).toBeNull();
    fireEvent.click(chip);
    // Sorted by sortOrder even though the slugs arrived reversed.
    const intro = screen.getByText('Intro to Python');
    const vars = screen.getByText('Variables');
    expect(intro).toBeDefined();
    expect(vars).toBeDefined();
    expect(intro.compareDocumentPosition(vars) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('omits hidden sections', async () => {
    mockGetPublicProfile.mockResolvedValue({
      ...fullProfile,
      bio: null,
      status: null,
      stats: null,
      progress: null,
      activity: null,
    });
    renderPage();
    await screen.findByText('Nova');
    expect(screen.queryByText('Exploring the cosmos')).toBeNull();
    expect(screen.queryByText('Lessons Done')).toBeNull();
    expect(screen.queryByText('Badges')).toBeNull();
    expect(screen.queryByText('Activity')).toBeNull();
  });

  it('renders the activity heatmap when activity is present', async () => {
    renderPage();
    await screen.findByText('Nova');
    expect(screen.getByText('Activity')).toBeDefined();
  });

  it('shows owner actions when viewing your own profile', async () => {
    mockGetPublicProfile.mockResolvedValue({ ...fullProfile, isSelf: true });
    renderPage();
    const edit = await screen.findByText('Edit profile');
    expect(screen.queryByText('Send message')).toBeNull();
    fireEvent.click(edit);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
    fireEvent.click(screen.getByText('Settings'));
    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  it('hides the Send message button for logged-out visitors', async () => {
    renderPage();
    await screen.findByText('Nova');
    expect(screen.queryByText('Send message')).toBeNull();
  });

  it('opens a conversation from the Send message button', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, role: 'USER' },
      isLoading: false,
    } as unknown as ReturnType<typeof useAuth>);
    mockOpenWith.mockResolvedValue({ id: 55 });
    renderPage();
    const btn = await screen.findByText('Send message');
    fireEvent.click(btn);
    await waitFor(() => expect(mockOpenWith).toHaveBeenCalledWith(7));
    expect(mockNavigate).toHaveBeenCalledWith('/messages', {
      state: { openConversationId: 55 },
    });
  });

  it('shows the not-found message on a 404', async () => {
    mockGetPublicProfile.mockRejectedValue({ status: 404 });
    renderPage();
    expect(await screen.findByText('This explorer could not be found.')).toBeDefined();
  });

  it('shows a generic error on other failures', async () => {
    mockGetPublicProfile.mockRejectedValue({ status: 500 });
    renderPage();
    expect(await screen.findByText('Could not load this profile.')).toBeDefined();
  });

  it('treats an invalid id param as not found without hitting the API', async () => {
    mockParams = { userId: 'abc' };
    renderPage();
    expect(await screen.findByText('This explorer could not be found.')).toBeDefined();
    expect(mockGetPublicProfile).not.toHaveBeenCalled();
  });

  it('resets the messaging state when opening a conversation fails', async () => {
    loggedIn();
    mockOpenWith.mockRejectedValue(new Error('nope'));
    renderPage();
    const btn = (await screen.findByText('Send message')) as HTMLButtonElement;
    fireEvent.click(btn);
    await waitFor(() => expect(btn).not.toBeDisabled());
    expect(mockNavigate).not.toHaveBeenCalledWith('/messages', expect.anything());
  });

  it('sends a connection request and shows the pending state', async () => {
    loggedIn();
    mockSendRequest.mockResolvedValue(
      undefined as unknown as Awaited<ReturnType<typeof connectionsService.sendRequest>>,
    );
    renderPage();
    const connect = await screen.findByText('Connect');
    fireEvent.click(connect);
    await waitFor(() => expect(mockSendRequest).toHaveBeenCalledWith(7));
    expect(await screen.findByText('Request sent')).toBeDefined();
  });

  it('re-enables the connect button when the request fails', async () => {
    loggedIn();
    mockSendRequest.mockRejectedValue(new Error('boom'));
    renderPage();
    const connect = (await screen.findByText('Connect')) as HTMLButtonElement;
    fireEvent.click(connect);
    await waitFor(() => expect(mockSendRequest).toHaveBeenCalled());
    expect(await screen.findByText('Connect')).not.toBeDisabled();
  });

  it('shows the respond button for an incoming request', async () => {
    loggedIn();
    mockGetPublicProfile.mockResolvedValue({
      ...fullProfile,
      connectionRelation: 'pending_incoming',
    });
    renderPage();
    const respond = await screen.findByText('Respond to request');
    fireEvent.click(respond);
    expect(mockNavigate).toHaveBeenCalledWith('/connections');
  });

  it('shows the connected state', async () => {
    loggedIn();
    mockGetPublicProfile.mockResolvedValue({
      ...fullProfile,
      connectionRelation: 'connected',
    });
    renderPage();
    expect(await screen.findByText(/Connected/)).toBeDefined();
  });

  it('renders the connections list and navigates to a connection', async () => {
    mockGetPublicProfile.mockResolvedValue({
      ...fullProfile,
      connections: {
        count: 2,
        users: [
          { id: 8, name: 'Orion', avatarUrl: null },
          { id: 9, name: 'Lyra', avatarUrl: '/uploads/lyra.png' },
        ],
      },
    });
    renderPage();
    await screen.findByText('Nova');
    fireEvent.click(screen.getByText('Orion'));
    expect(mockNavigate).toHaveBeenCalledWith('/u/8');
  });

  it('omits the streak flame when the streak is zero', async () => {
    mockGetPublicProfile.mockResolvedValue({
      ...fullProfile,
      stats: { ...fullProfile.stats!, streak: 0 },
    });
    renderPage();
    await screen.findByText('Nova');
    expect(screen.queryByText('🔥')).toBeNull();
  });

  it('renders an avatar image when a url is present', async () => {
    mockGetPublicProfile.mockResolvedValue({ ...fullProfile, avatarUrl: '/uploads/nova.png' });
    renderPage();
    await screen.findByText('Nova');
    const img = document.querySelector('img[src="/uploads/nova.png"]');
    expect(img).not.toBeNull();
  });

  it('expands a course with no curriculum entry using raw slugs', async () => {
    renderPage();
    await screen.findByText('Nova');
    fireEvent.click(screen.getByText('C Algorithms'));
    expect(screen.getByText('ac-1')).toBeDefined();
  });

  it('collapses an expanded course on a second click', async () => {
    renderPage();
    await screen.findByText('Nova');
    const chip = screen.getByText('Python');
    fireEvent.click(chip);
    expect(screen.getByText('Intro to Python')).toBeDefined();
    fireEvent.click(chip);
    expect(screen.queryByText('Intro to Python')).toBeNull();
  });

  it('renders a fallback for a completed slug unknown to the curriculum', async () => {
    mockGetPublicProfile.mockResolvedValue({
      ...fullProfile,
      stats: {
        ...fullProfile.stats!,
        courses: [{ courseKey: 'python', lessons: ['py-1', 'ghost-lesson'] }],
      },
    });
    renderPage();
    await screen.findByText('Nova');
    fireEvent.click(screen.getByText('Python'));
    expect(screen.getByText('ghost-lesson')).toBeDefined();
  });

  it('shows a spinner while auth is still loading', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: true } as ReturnType<typeof useAuth>);
    renderPage();
    expect(screen.queryByText('Nova')).toBeNull();
    expect(mockGetPublicProfile).not.toHaveBeenCalled();
  });

  it('hides the rank chip when no rank is available', async () => {
    mockGetPublicProfile.mockResolvedValue({
      ...fullProfile,
      progress: { ...fullProfile.progress!, rank: null },
    });
    renderPage();
    await screen.findByText('Nova');
    expect(screen.queryByText('#5')).toBeNull();
  });
});
