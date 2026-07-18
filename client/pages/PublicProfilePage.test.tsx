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
vi.mock('../services/messagesService', () => ({ openConversation: vi.fn() }));

const { useAuth } = await import('../context/AuthContext');
const mockUseAuth = vi.mocked(useAuth);
const userService = await import('../services/userService');
const mockGetPublicProfile = vi.mocked(userService.getPublicProfile);
const messagesService = await import('../services/messagesService');
const mockOpenConversation = vi.mocked(messagesService.openConversation);

const { PublicProfilePage } = await import('./PublicProfilePage');

const fullProfile: PublicProfile = {
  userId: 7,
  name: 'Nova',
  avatarUrl: null,
  memberSince: '2025-01-01T00:00:00.000Z',
  isSelf: false,
  status: 'coding',
  bio: 'Exploring the cosmos',
  stats: { lessonsDone: 12, activeCourses: 2, streak: 4 },
  progress: { level: 3, totalXp: 250, titleKey: 'level.title.3', rank: 5, badges: 6 },
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
    expect(screen.getByText('Badges')).toBeDefined();
    expect(screen.getByText('Day Streak')).toBeDefined();
    expect(screen.getByText('#5')).toBeDefined();
    expect(screen.getByText(/250/)).toBeDefined();
  });

  it('omits hidden sections', async () => {
    mockGetPublicProfile.mockResolvedValue({
      ...fullProfile,
      bio: null,
      status: null,
      stats: null,
      progress: null,
    });
    renderPage();
    await screen.findByText('Nova');
    expect(screen.queryByText('Exploring the cosmos')).toBeNull();
    expect(screen.queryByText('Lessons Done')).toBeNull();
    expect(screen.queryByText('Badges')).toBeNull();
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

  it('opens a conversation from the Send message button', async () => {
    mockOpenConversation.mockResolvedValue({
      conversation: { id: 55 },
    } as Awaited<ReturnType<typeof messagesService.openConversation>>);
    renderPage();
    const btn = await screen.findByText('Send message');
    fireEvent.click(btn);
    await waitFor(() => expect(mockOpenConversation).toHaveBeenCalledWith(7));
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
});
