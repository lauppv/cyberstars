import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { AuthenticatedUser } from '../../shared/auth';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));
vi.mock('../hooks/useBackgroundPref', () => ({
  useBackgroundPref: () => ['cosmos', mockSetBackground],
}));
vi.mock('../services/profileService', () => ({
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
  requestEmailChange: vi.fn(),
  confirmEmailChange: vi.fn(),
  cancelEmailChange: vi.fn(),
}));

const mockSetBackground = vi.fn();

const { useAuth } = await import('../context/AuthContext');
const mockUseAuth = vi.mocked(useAuth);
const profileService = await import('../services/profileService');
const mockUpdateProfile = vi.mocked(profileService.updateProfile);
const mockChangePassword = vi.mocked(profileService.changePassword);
const mockRequestEmailChange = vi.mocked(profileService.requestEmailChange);
const mockConfirmEmailChange = vi.mocked(profileService.confirmEmailChange);
const mockCancelEmailChange = vi.mocked(profileService.cancelEmailChange);

const { SettingsPage } = await import('./SettingsPage');

const baseUser: AuthenticatedUser = {
  id: 1,
  name: 'Nova',
  email: 'nova@example.com',
  role: 'USER',
  avatarUrl: null,
  bio: null,
  status: null,
  statusExpiresAt: null,
  pendingEmail: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  showBio: true,
  showStats: true,
  showProgress: false,
  showActivity: true,
  showConnections: true,
};

const refreshUser = vi.fn();

function authState(overrides: Record<string, unknown> = {}) {
  return {
    user: baseUser,
    isLoggedIn: true,
    isLoading: false,
    refreshUser,
    ...overrides,
  } as unknown as ReturnType<typeof useAuth>;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>,
  );
}

function passwordForm() {
  return screen.getByText('Change password').closest('form') as HTMLFormElement;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAuth.mockReturnValue(authState());
});

describe('SettingsPage', () => {
  it('redirects to /getstarted when signed out', () => {
    mockUseAuth.mockReturnValue(authState({ isLoggedIn: false, user: null }));
    renderPage();
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });

  it('shows a spinner while auth is loading', () => {
    mockUseAuth.mockReturnValue(authState({ isLoading: true, user: null }));
    renderPage();
    expect(screen.queryByText('Privacy')).toBeNull();
  });

  it('renders preferences, privacy and account sections', () => {
    renderPage();
    expect(screen.getByText('Privacy')).toBeDefined();
    expect(screen.getByText('Change password')).toBeDefined();
    expect(screen.getByText('Email address')).toBeDefined();
  });

  it('reflects the user privacy flags on the toggles', () => {
    renderPage();
    expect(screen.getByRole('switch', { name: 'Bio & status' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('switch', { name: 'Level, XP & badges' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('persists a privacy toggle and refreshes the user', async () => {
    mockUpdateProfile.mockResolvedValue({ message: 'ok' });
    renderPage();
    fireEvent.click(screen.getByRole('switch', { name: 'Bio & status' }));
    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledWith({ showBio: false }));
    expect(refreshUser).toHaveBeenCalled();
  });

  it('reverts a toggle when the update fails', async () => {
    mockUpdateProfile.mockRejectedValue(new Error('boom'));
    renderPage();
    const toggle = screen.getByRole('switch', { name: 'Bio & status' });
    fireEvent.click(toggle);
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'true'));
  });

  it('switches the background preference', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Minimal' }));
    expect(mockSetBackground).toHaveBeenCalledWith('minimal');
  });

  it('rejects a too-short new password without calling the API', () => {
    renderPage();
    const [current, next, confirm] = passwordForm().querySelectorAll('input[type=password]');
    fireEvent.change(current, { target: { value: 'oldpass' } });
    fireEvent.change(next, { target: { value: '12345' } });
    fireEvent.change(confirm, { target: { value: '12345' } });
    fireEvent.submit(passwordForm());
    expect(screen.getByText('Must be at least 6 characters')).toBeDefined();
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it('rejects mismatched passwords', () => {
    renderPage();
    const [current, next, confirm] = passwordForm().querySelectorAll('input[type=password]');
    fireEvent.change(current, { target: { value: 'oldpass' } });
    fireEvent.change(next, { target: { value: '123456' } });
    fireEvent.change(confirm, { target: { value: '654321' } });
    fireEvent.submit(passwordForm());
    expect(screen.getByText('Passwords do not match')).toBeDefined();
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it('submits a valid password change', async () => {
    mockChangePassword.mockResolvedValue({ message: 'ok' } as Awaited<
      ReturnType<typeof profileService.changePassword>
    >);
    renderPage();
    const [current, next, confirm] = passwordForm().querySelectorAll('input[type=password]');
    fireEvent.change(current, { target: { value: 'oldpass' } });
    fireEvent.change(next, { target: { value: '123456' } });
    fireEvent.change(confirm, { target: { value: '123456' } });
    fireEvent.submit(passwordForm());
    await waitFor(() =>
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpass',
        newPassword: '123456',
      }),
    );
    expect(await screen.findByText('Password updated')).toBeDefined();
  });

  it('requests an email change', async () => {
    mockRequestEmailChange.mockResolvedValue({ message: 'sent' } as Awaited<
      ReturnType<typeof profileService.requestEmailChange>
    >);
    renderPage();
    const emailForm = screen.getByText('Send confirmation code').closest('form') as HTMLFormElement;
    const emailInput = emailForm.querySelector('input[type=email]') as HTMLInputElement;
    const pwInput = emailForm.querySelector('input[type=password]') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(pwInput, { target: { value: 'oldpass' } });
    fireEvent.submit(emailForm);
    await waitFor(() =>
      expect(mockRequestEmailChange).toHaveBeenCalledWith({
        currentPassword: 'oldpass',
        newEmail: 'new@example.com',
      }),
    );
  });

  it('shows an error message when the email request fails', async () => {
    mockRequestEmailChange.mockRejectedValue(new Error('wrong password'));
    renderPage();
    const emailForm = screen.getByText('Send confirmation code').closest('form') as HTMLFormElement;
    const emailInput = emailForm.querySelector('input[type=email]') as HTMLInputElement;
    const pwInput = emailForm.querySelector('input[type=password]') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(pwInput, { target: { value: 'bad' } });
    fireEvent.submit(emailForm);
    expect(await screen.findByText('wrong password')).toBeDefined();
  });

  it('falls back to a generic error when the email request throws a non-Error', async () => {
    mockRequestEmailChange.mockRejectedValue('boom');
    renderPage();
    const emailForm = screen.getByText('Send confirmation code').closest('form') as HTMLFormElement;
    const emailInput = emailForm.querySelector('input[type=email]') as HTMLInputElement;
    const pwInput = emailForm.querySelector('input[type=password]') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(pwInput, { target: { value: 'bad' } });
    fireEvent.submit(emailForm);
    expect(await screen.findByText('Error')).toBeDefined();
  });

  it('shows the error message when the password change fails with an Error', async () => {
    mockChangePassword.mockRejectedValue(new Error('current password wrong'));
    renderPage();
    const [current, next, confirm] = passwordForm().querySelectorAll('input[type=password]');
    fireEvent.change(current, { target: { value: 'oldpass' } });
    fireEvent.change(next, { target: { value: '123456' } });
    fireEvent.change(confirm, { target: { value: '123456' } });
    fireEvent.submit(passwordForm());
    expect(await screen.findByText('current password wrong')).toBeDefined();
  });

  it('shows a generic error when the password change throws a non-Error', async () => {
    mockChangePassword.mockRejectedValue('kaboom');
    renderPage();
    const [current, next, confirm] = passwordForm().querySelectorAll('input[type=password]');
    fireEvent.change(current, { target: { value: 'oldpass' } });
    fireEvent.change(next, { target: { value: '123456' } });
    fireEvent.change(confirm, { target: { value: '123456' } });
    fireEvent.submit(passwordForm());
    expect(await screen.findByText('Error')).toBeDefined();
  });

  it('toggles visibility of every password field', () => {
    renderPage();
    // Email form's password field.
    const emailForm = screen.getByText('Send confirmation code').closest('form') as HTMLFormElement;
    const emailPw = emailForm.querySelector('input[type=password]') as HTMLInputElement;
    fireEvent.click(emailForm.querySelector('button[aria-label="Show password"]') as HTMLElement);
    expect(emailPw).toHaveAttribute('type', 'text');
    // All three password fields in the security form.
    const inputs = passwordForm().querySelectorAll('input');
    const toggles = passwordForm().querySelectorAll('button[aria-label="Show password"]');
    expect(toggles).toHaveLength(3);
    toggles.forEach((btn) => fireEvent.click(btn));
    inputs.forEach((input) => expect(input).toHaveAttribute('type', 'text'));
    passwordForm()
      .querySelectorAll('button[aria-label="Hide password"]')
      .forEach((btn) => fireEvent.click(btn));
    inputs.forEach((input) => expect(input).toHaveAttribute('type', 'password'));
  });

  describe('with a pending email change', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(
        authState({ user: { ...baseUser, pendingEmail: 'pending@example.com' } }),
      );
    });

    it('renders the confirmation form', () => {
      renderPage();
      expect(screen.getByText('Confirm new email')).toBeDefined();
    });

    it('confirms the email change', async () => {
      mockConfirmEmailChange.mockResolvedValue({ email: 'pending@example.com' } as Awaited<
        ReturnType<typeof profileService.confirmEmailChange>
      >);
      renderPage();
      const form = screen.getByText('Confirm new email').closest('form') as HTMLFormElement;
      const codeInput = form.querySelector('input') as HTMLInputElement;
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.submit(form);
      await waitFor(() => expect(mockConfirmEmailChange).toHaveBeenCalledWith({ code: '123456' }));
      expect(refreshUser).toHaveBeenCalled();
    });

    it('shows an error when confirmation fails', async () => {
      mockConfirmEmailChange.mockRejectedValue(new Error('bad code'));
      renderPage();
      const form = screen.getByText('Confirm new email').closest('form') as HTMLFormElement;
      const codeInput = form.querySelector('input') as HTMLInputElement;
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.submit(form);
      expect(await screen.findByText('bad code')).toBeDefined();
    });

    it('shows a generic error when confirmation throws a non-Error', async () => {
      mockConfirmEmailChange.mockRejectedValue('boom');
      renderPage();
      const form = screen.getByText('Confirm new email').closest('form') as HTMLFormElement;
      const codeInput = form.querySelector('input') as HTMLInputElement;
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.submit(form);
      expect(await screen.findByText('Error')).toBeDefined();
    });

    it('shows a generic error when cancellation throws a non-Error', async () => {
      mockCancelEmailChange.mockRejectedValue('boom');
      renderPage();
      fireEvent.click(screen.getByText('Cancel'));
      expect(await screen.findByText('Error')).toBeDefined();
    });

    it('cancels the pending email change', async () => {
      mockCancelEmailChange.mockResolvedValue({ message: 'ok' } as Awaited<
        ReturnType<typeof profileService.cancelEmailChange>
      >);
      renderPage();
      fireEvent.click(screen.getByText('Cancel'));
      await waitFor(() => expect(mockCancelEmailChange).toHaveBeenCalled());
      expect(refreshUser).toHaveBeenCalled();
    });

    it('shows an error when cancellation fails', async () => {
      mockCancelEmailChange.mockRejectedValue(new Error('cannot cancel'));
      renderPage();
      fireEvent.click(screen.getByText('Cancel'));
      expect(await screen.findByText('cannot cancel')).toBeDefined();
    });

    it('strips non-digits from the confirmation code', () => {
      renderPage();
      const form = screen.getByText('Confirm new email').closest('form') as HTMLFormElement;
      const codeInput = form.querySelector('input') as HTMLInputElement;
      fireEvent.change(codeInput, { target: { value: 'a1b2c3d4e5' } });
      expect(codeInput.value).toBe('12345');
    });
  });
});
