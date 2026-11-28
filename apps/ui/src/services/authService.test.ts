import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = { get: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const authService = await import('./authService');

beforeEach(() => {
  vi.clearAllMocks();
  mockApi.get.mockResolvedValue({});
  mockApi.post.mockResolvedValue({});
});

describe('authService', () => {
  it('logs in with the credentials', async () => {
    await authService.login({ email: 'ada@test.dev', password: 'hunter2' });
    expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'ada@test.dev',
      password: 'hunter2',
    });
  });

  it('signs up with the profile payload and the language the link is written in', async () => {
    await authService.signup({ name: 'Ada', email: 'ada@test.dev', password: 'hunter2' });
    expect(mockApi.post).toHaveBeenCalledWith('/auth/signup', {
      name: 'Ada',
      email: 'ada@test.dev',
      password: 'hunter2',
      lang: 'en',
    });
  });

  it('confirms an email with the token of its link', async () => {
    await authService.confirmEmail('tok');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/confirm-email', { token: 'tok' });
  });

  it('asks for a new confirmation link in the page language', async () => {
    await authService.resendConfirmation();
    expect(mockApi.post).toHaveBeenCalledWith('/auth/confirm-email/resend', { lang: 'en' });
  });

  it('logs out without a body', async () => {
    await authService.logout();
    expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('fetches the current user', async () => {
    await authService.getMe();
    expect(mockApi.get).toHaveBeenCalledWith('/auth/me');
  });

  it('requests a reset code for an email', async () => {
    await authService.forgotPassword('ada@test.dev');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'ada@test.dev',
      lang: 'en',
    });
  });

  it('submits the reset code with the new password', async () => {
    await authService.resetPassword('ada@test.dev', '123456', 'newpass');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/reset-password', {
      email: 'ada@test.dev',
      code: '123456',
      password: 'newpass',
    });
  });
});
