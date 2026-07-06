import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSendMail = vi.fn();

vi.mock('nodemailer', () => ({
  default: {
    createTransport: () => ({ sendMail: mockSendMail }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('sendResetCode', () => {
  it('sends an email with the reset code when SMTP is configured', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { smtp: { user: 'test@gmail.com', pass: 'secret' } },
    }));
    const { sendResetCode } = await import('./email.service.js');

    mockSendMail.mockResolvedValue({});
    await sendResetCode('user@test.com', '123456');

    expect(mockSendMail).toHaveBeenCalledOnce();
    const call = mockSendMail.mock.calls[0][0];
    expect(call.to).toBe('user@test.com');
    expect(call.html).toContain('123456');
    expect(call.subject).toContain('Password Reset');
  });

  it('logs to console instead of sending when SMTP is unconfigured', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { smtp: { user: '', pass: '' } },
    }));
    const { sendResetCode } = await import('./email.service.js');

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await sendResetCode('dev@test.com', '654321');

    expect(mockSendMail).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('654321'));
    logSpy.mockRestore();
  });
});

describe('sendEmailChangeCode', () => {
  it('sends an email with the confirmation code when SMTP is configured', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { smtp: { user: 'test@gmail.com', pass: 'secret' } },
    }));
    const { sendEmailChangeCode } = await import('./email.service.js');

    mockSendMail.mockResolvedValue({});
    await sendEmailChangeCode('new@test.com', '246810');

    expect(mockSendMail).toHaveBeenCalledOnce();
    const call = mockSendMail.mock.calls[0][0];
    expect(call.to).toBe('new@test.com');
    expect(call.html).toContain('246810');
    expect(call.subject).toContain('New Email');
  });

  it('logs to console instead of sending when SMTP is unconfigured', async () => {
    vi.doMock('../config/index.js', () => ({
      config: { smtp: { user: '', pass: '' } },
    }));
    const { sendEmailChangeCode } = await import('./email.service.js');

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await sendEmailChangeCode('dev@test.com', '135791');

    expect(mockSendMail).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('135791'));
    logSpy.mockRestore();
  });
});
