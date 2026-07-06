import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSend = vi.fn();

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('sendResetCode', () => {
  it('sends an email with the reset code when Resend is configured', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { resend: { apiKey: 're_test', from: 'CyberStars <noreply@cyber-stars.org>' } },
    }));
    const { sendResetCode } = await import('./email.service.js');

    mockSend.mockResolvedValue({ data: { id: 'x' }, error: null });
    await sendResetCode('user@test.com', '123456');

    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toBe('user@test.com');
    expect(call.from).toBe('CyberStars <noreply@cyber-stars.org>');
    expect(call.html).toContain('123456');
    expect(call.subject).toContain('Password Reset');
  });

  it('logs to console instead of sending when Resend is unconfigured', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { resend: { apiKey: '', from: 'CyberStars <noreply@cyber-stars.org>' } },
    }));
    const { sendResetCode } = await import('./email.service.js');

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await sendResetCode('dev@test.com', '654321');

    expect(mockSend).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('654321'));
    logSpy.mockRestore();
  });

  it('throws when Resend returns an error', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { resend: { apiKey: 're_test', from: 'CyberStars <noreply@cyber-stars.org>' } },
    }));
    const { sendResetCode } = await import('./email.service.js');

    mockSend.mockResolvedValue({ data: null, error: { message: 'invalid api key' } });
    await expect(sendResetCode('user@test.com', '000000')).rejects.toThrow(/invalid api key/);
  });
});

describe('sendEmailChangeCode', () => {
  it('sends an email with the confirmation code when Resend is configured', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { resend: { apiKey: 're_test', from: 'CyberStars <noreply@cyber-stars.org>' } },
    }));
    const { sendEmailChangeCode } = await import('./email.service.js');

    mockSend.mockResolvedValue({ data: { id: 'x' }, error: null });
    await sendEmailChangeCode('new@test.com', '246810');

    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toBe('new@test.com');
    expect(call.html).toContain('246810');
    expect(call.subject).toContain('New Email');
  });

  it('logs to console instead of sending when Resend is unconfigured', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { resend: { apiKey: '', from: 'CyberStars <noreply@cyber-stars.org>' } },
    }));
    const { sendEmailChangeCode } = await import('./email.service.js');

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await sendEmailChangeCode('dev@test.com', '135791');

    expect(mockSend).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('135791'));
    logSpy.mockRestore();
  });
});
