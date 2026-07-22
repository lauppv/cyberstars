import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { LeaderboardEntry } from '../../shared/leaderboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: null, isLoggedIn: false, isLoading: false })),
}));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../services/leaderboardService', () => ({
  getLeaderboard: vi.fn(),
  getMyRank: vi.fn(),
}));

const { useAuth } = await import('../context/AuthContext');
const mockUseAuth = vi.mocked(useAuth);
const leaderboardService = await import('../services/leaderboardService');
const mockGetLeaderboard = vi.mocked(leaderboardService.getLeaderboard);
const mockGetMyRank = vi.mocked(leaderboardService.getMyRank);

const { LeaderboardPage } = await import('./LeaderboardPage');

const ada: LeaderboardEntry = {
  rank: 1,
  userId: 1,
  name: 'Ada',
  avatarUrl: null,
  totalXp: 220,
  lessonsDone: 12,
  level: 2,
  titleKey: 'level.title.2',
};
const bo: LeaderboardEntry = {
  rank: 2,
  userId: 2,
  name: 'Bo',
  avatarUrl: '/b.png',
  totalXp: 100,
  lessonsDone: 6,
  level: 1,
  titleKey: 'level.title.1',
};

function renderPage() {
  return render(
    <MemoryRouter>
      <LeaderboardPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  // The board is logged-in only, so the default visitor is a signed-in USER.
  mockUseAuth.mockReturnValue({
    user: { role: 'USER' },
    isLoggedIn: true,
    isLoading: false,
  } as ReturnType<typeof useAuth>);
  mockGetLeaderboard.mockResolvedValue({ entries: [ada, bo], total: 2 });
  mockGetMyRank.mockResolvedValue(null);
});

describe('LeaderboardPage', () => {
  it('renders ranked rows after loading', async () => {
    renderPage();
    expect(await screen.findByText('Ada')).toBeDefined();
    expect(screen.getByText('Bo')).toBeDefined();
    expect(screen.getByText('220 XP')).toBeDefined();
  });

  it('redirects a guest away and does not fetch', async () => {
    mockUseAuth.mockReturnValue({ user: null, isLoggedIn: false, isLoading: false } as ReturnType<
      typeof useAuth
    >);
    renderPage();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    expect(mockGetLeaderboard).not.toHaveBeenCalled();
  });

  it('highlights the current user with a "You" badge', async () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'USER' },
      isLoggedIn: true,
      isLoading: false,
    } as ReturnType<typeof useAuth>);
    mockGetMyRank.mockResolvedValue(ada);
    renderPage();
    expect(await screen.findByText('You')).toBeDefined();
  });

  it('pins "Your rank" when the user is not on the loaded page', async () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'USER' },
      isLoggedIn: true,
      isLoading: false,
    } as ReturnType<typeof useAuth>);
    mockGetMyRank.mockResolvedValue({ ...bo, userId: 99, name: 'Zed', rank: 40 });
    renderPage();
    expect(await screen.findByText('Your rank')).toBeDefined();
    expect(screen.getByText('Zed')).toBeDefined();
  });

  it('loads more entries on demand', async () => {
    mockGetLeaderboard.mockReset();
    mockGetLeaderboard
      .mockResolvedValueOnce({ entries: [ada], total: 2 })
      .mockResolvedValueOnce({ entries: [bo], total: 2 });
    renderPage();
    const button = await screen.findByText('Load more');
    fireEvent.click(button);
    expect(await screen.findByText('Bo')).toBeDefined();
    await waitFor(() => expect(screen.queryByText('Load more')).toBeNull());
  });

  it('shows an empty state when nobody has XP', async () => {
    mockGetLeaderboard.mockResolvedValue({ entries: [], total: 0 });
    renderPage();
    expect(await screen.findByText(/Complete a lesson to claim the top spot/)).toBeDefined();
  });

  it('shows an error state when the request fails', async () => {
    mockGetLeaderboard.mockRejectedValue(new Error('boom'));
    renderPage();
    expect(await screen.findByText(/Could not load the leaderboard/)).toBeDefined();
  });

  it('stays in loading while auth is resolving', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoggedIn: false, isLoading: true } as ReturnType<
      typeof useAuth
    >);
    renderPage();
    expect(mockGetLeaderboard).not.toHaveBeenCalled();
  });
});
