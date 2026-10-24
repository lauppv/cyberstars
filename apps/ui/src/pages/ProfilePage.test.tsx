import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { AuthenticatedUser } from '@cyberstars/shared/auth';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../hooks/useGamification', () => ({
  useGamification: () => ({
    xp: {
      level: 1,
      titleKey: 'level.title.1',
      earnedXp: 0,
      xpPct: 0,
      xpIntoLevel: 0,
      xpForLevelSpan: 100,
    },
    badges: [],
    totalCompleted: 0,
  }),
}));
vi.mock('../context/CurriculumContext', () => ({ useCurriculum: () => ({ courses: [] }) }));
vi.mock('../context/ProgressContext', () => ({ useAllProgress: () => ({ progressMap: {} }) }));
vi.mock('../services/profileService', () => ({
  updateProfile: vi.fn(),
  uploadAvatar: vi.fn(),
  removeAvatar: vi.fn(),
  getActivity: vi.fn(),
}));

const { useAuth } = await import('../context/AuthContext');
const mockUseAuth = vi.mocked(useAuth);
const profileService = await import('../services/profileService');
const mockUpdateProfile = vi.mocked(profileService.updateProfile);
const mockRemoveAvatar = vi.mocked(profileService.removeAvatar);
const mockGetActivity = vi.mocked(profileService.getActivity);

const { ProfilePage } = await import('./ProfilePage');

const baseUser: AuthenticatedUser = {
  id: 1,
  name: 'Nova',
  email: 'nova@example.com',
  role: 'USER',
  avatarUrl: '/uploads/nova.png',
  bio: 'Old bio',
  status: 'Old status',
  statusExpiresAt: null,
  pendingEmail: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  showBio: true,
  showStats: true,
  showProgress: true,
  showConnections: true,
  onboardedAt: '2024-01-01T00:00:00Z',
  placementLevel: null,
  interests: ['python'],
  codeLanguage: null,
};

const refreshUser = vi.fn();

function authState(user: AuthenticatedUser = baseUser) {
  return {
    user,
    isLoggedIn: true,
    isLoading: false,
    refreshUser,
  } as unknown as ReturnType<typeof useAuth>;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  );
}

const bioField = () => screen.getByPlaceholderText('Tell others about yourself...');
const statusField = () => screen.getByPlaceholderText('What are you up to?');

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAuth.mockReturnValue(authState());
  mockGetActivity.mockResolvedValue({ streak: 2 } as Awaited<
    ReturnType<typeof profileService.getActivity>
  >);
  mockUpdateProfile.mockResolvedValue(undefined as never);
  mockRemoveAvatar.mockResolvedValue(undefined as never);
});

describe('ProfilePage', () => {
  it('saves the bio when the field loses focus', async () => {
    renderPage();
    fireEvent.change(bioField(), { target: { value: 'New bio' } });
    fireEvent.blur(bioField());
    await waitFor(() => expect(refreshUser).toHaveBeenCalled());
    expect(mockUpdateProfile).toHaveBeenCalledWith({ bio: 'New bio' });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('says why the bio was not saved and keeps the text', async () => {
    mockUpdateProfile.mockRejectedValueOnce(new Error('Bio is too long'));
    renderPage();
    fireEvent.change(bioField(), { target: { value: 'New bio' } });
    fireEvent.blur(bioField());
    expect(await screen.findByRole('alert')).toHaveTextContent('Bio is too long');
    expect(bioField()).toHaveValue('New bio');
    expect(refreshUser).not.toHaveBeenCalled();
  });

  it('clears the bio message once a save works', async () => {
    mockUpdateProfile.mockRejectedValueOnce(new Error('Bio is too long'));
    renderPage();
    fireEvent.blur(bioField());
    await screen.findByRole('alert');
    fireEvent.blur(bioField());
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('says why the status was not saved and keeps the text', async () => {
    mockUpdateProfile.mockRejectedValueOnce('nope');
    renderPage();
    fireEvent.change(statusField(), { target: { value: 'Studying' } });
    fireEvent.click(screen.getByRole('button', { name: 'Set' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Something went wrong. Please try again.',
    );
    expect(statusField()).toHaveValue('Studying');
  });

  it('keeps a bio that failed when the status saves', async () => {
    mockUpdateProfile.mockRejectedValueOnce(new Error('Bio is too long'));
    const { rerender } = renderPage();
    fireEvent.change(bioField(), { target: { value: 'Unsaved bio' } });
    fireEvent.blur(bioField());
    await screen.findByRole('alert');
    fireEvent.change(statusField(), { target: { value: 'Studying' } });
    fireEvent.click(screen.getByRole('button', { name: 'Set' }));
    await waitFor(() => expect(refreshUser).toHaveBeenCalled());
    mockUseAuth.mockReturnValue(authState({ ...baseUser, status: 'Studying' }));
    rerender(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );
    expect(bioField()).toHaveValue('Unsaved bio');
    expect(statusField()).toHaveValue('Studying');
  });

  it("shows what is saved once the account's bio changes", () => {
    const { rerender } = renderPage();
    expect(bioField()).toHaveValue('Old bio');
    mockUseAuth.mockReturnValue(authState({ ...baseUser, bio: null }));
    rerender(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );
    expect(bioField()).toHaveValue('');
  });

  it('removes the avatar', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Remove avatar' }));
    await waitFor(() => expect(refreshUser).toHaveBeenCalled());
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('says why the avatar was not removed', async () => {
    mockRemoveAvatar.mockRejectedValueOnce(new Error('User not found'));
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Remove avatar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('User not found');
    expect(refreshUser).not.toHaveBeenCalled();
  });
});
