import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSendMail = vi.fn();

vi.mock('nodemailer', () => ({
  default: {
    createTransport: () => ({ sendMail: mockSendMail }),
  },
}));

vi.mock('../config/index.js', () => ({
  config: {
    smtp: { user: 'test@gmail.com', pass: 'secret' },
  },
}));

const { sendResetCode } = await import('./email.service.js');

beforeEach(() => vi.clearAllMocks());

describe('sendResetCode', () => {
  it('sends an email with the reset code', async () => {
    mockSendMail.mockResolvedValue({});
    await sendResetCode('user@test.com', '123456');
    expect(mockSendMail).toHaveBeenCalledOnce();
    const call = mockSendMail.mock.calls[0][0];
    expect(call.to).toBe('user@test.com');
    expect(call.html).toContain('123456');
    expect(call.subject).toContain('Password Reset');
  });
});
