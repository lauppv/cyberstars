import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

const {
  mockMkdir,
  mockWriteFile,
  mockUnlink,
  mockFindById,
  mockUpdateProfile,
  mockFileType,
  mockFindByIdWithPassword,
  mockUpdatePassword,
  mockGetActivityDates,
  mockFindByEmail,
  mockSetPendingEmailChange,
  mockFindPendingEmailChange,
  mockApplyPendingEmailChange,
  mockClearPendingEmailChange,
  mockSendEmailChangeCode,
} = vi.hoisted(() => ({
  mockMkdir: vi.fn(),
  mockWriteFile: vi.fn(),
  mockUnlink: vi.fn(),
  mockFindById: vi.fn(),
  mockUpdateProfile: vi.fn(),
  mockFileType: vi.fn(),
  mockFindByIdWithPassword: vi.fn(),
  mockUpdatePassword: vi.fn(),
  mockGetActivityDates: vi.fn(),
  mockFindByEmail: vi.fn(),
  mockSetPendingEmailChange: vi.fn(),
  mockFindPendingEmailChange: vi.fn(),
  mockApplyPendingEmailChange: vi.fn(),
  mockClearPendingEmailChange: vi.fn(),
  mockSendEmailChangeCode: vi.fn(),
}));

vi.mock('fs/promises', () => {
  const mod = {
    mkdir: (...a: unknown[]) => mockMkdir(...a),
    writeFile: (...a: unknown[]) => mockWriteFile(...a),
    unlink: (...a: unknown[]) => mockUnlink(...a),
  };
  return { ...mod, default: mod };
});

vi.mock('file-type', () => ({ fileTypeFromBuffer: (...a: unknown[]) => mockFileType(...a) }));

vi.mock('../repositories/user.repository.js', () => ({
  findById: (...a: unknown[]) => mockFindById(...a),
  updateProfile: (...a: unknown[]) => mockUpdateProfile(...a),
  findByIdWithPassword: (...a: unknown[]) => mockFindByIdWithPassword(...a),
  updatePassword: (...a: unknown[]) => mockUpdatePassword(...a),
  findByEmail: (...a: unknown[]) => mockFindByEmail(...a),
  setPendingEmailChange: (...a: unknown[]) => mockSetPendingEmailChange(...a),
  findPendingEmailChange: (...a: unknown[]) => mockFindPendingEmailChange(...a),
  applyPendingEmailChange: (...a: unknown[]) => mockApplyPendingEmailChange(...a),
  clearPendingEmailChange: (...a: unknown[]) => mockClearPendingEmailChange(...a),
}));

// progress.repository pulls in db.ts -> env.ts (requires JWT_SECRET). Stub it
// so the controller module can import in envs without a full .env (e.g. CI).
vi.mock('../repositories/progress.repository.js', () => ({
  getActivityDates: (...a: unknown[]) => mockGetActivityDates(...a),
}));

// email.service pulls in config -> env.ts (JWT_SECRET), same story as above.
vi.mock('../services/email.service.js', () => ({
  sendResetCode: vi.fn(),
  sendEmailChangeCode: (...a: unknown[]) => mockSendEmailChangeCode(...a),
}));

const {
  uploadAvatar,
  deleteAvatar,
  updateProfile,
  changePassword,
  getActivity,
  requestEmailChange,
  confirmEmailChange,
  cancelEmailChange,
} = await import('./profile.controller.js');

// Stateful DB stand-in so a later request sees the avatarUrl an earlier one set.
let currentAvatar: string | null;
let nowCounter: number;

beforeEach(() => {
  vi.clearAllMocks();
  currentAvatar = null;
  nowCounter = 1000;
  vi.spyOn(Date, 'now').mockImplementation(() => nowCounter++);
  mockMkdir.mockResolvedValue(undefined);
  mockWriteFile.mockResolvedValue(undefined);
  mockUnlink.mockResolvedValue(undefined);
  mockFileType.mockResolvedValue({ mime: 'image/png', ext: 'png' });
  mockFindById.mockImplementation(async () => ({ avatarUrl: currentAvatar }));
  mockUpdateProfile.mockImplementation(async (_id: number, data: { avatarUrl?: string | null }) => {
    if ('avatarUrl' in data) currentAvatar = data.avatarUrl ?? null;
  });
});

const mkReq = () => ({ user: { id: 7 }, file: { buffer: Buffer.from('x') } }) as unknown as Request;
const mkRes = () => ({ json: vi.fn() }) as unknown as Response;

describe('uploadAvatar', () => {
  it('writes the file and persists the avatarUrl', async () => {
    const res = mkRes();
    await uploadAvatar(mkReq(), res, vi.fn());
    expect(mockWriteFile).toHaveBeenCalledTimes(1);
    expect(currentAvatar).toMatch(/^\/uploads\/avatars\/7-\d+\.png$/);
    expect(res.json).toHaveBeenCalledWith({ avatarUrl: currentAvatar });
  });

  it('rejects with 400 when no file is attached', async () => {
    const req = { user: { id: 7 }, file: undefined } as unknown as Request;
    const next = vi.fn();
    await uploadAvatar(req, mkRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('serializes concurrent uploads so no avatar file is orphaned (H10)', async () => {
    await Promise.all([
      uploadAvatar(mkReq(), mkRes(), vi.fn()),
      uploadAvatar(mkReq(), mkRes(), vi.fn()),
      uploadAvatar(mkReq(), mkRes(), vi.fn()),
    ]);

    const written = mockWriteFile.mock.calls.map((c) => path.basename(c[0] as string));
    const unlinked = mockUnlink.mock.calls.map((c) => path.basename(c[0] as string));
    const finalDb = currentAvatar ? path.basename(currentAvatar) : null;

    // Every file written except the one the DB now points at must be unlinked.
    const orphans = written.filter((f) => f !== finalDb && !unlinked.includes(f));
    expect(orphans).toEqual([]);
    // The current avatar must NOT have been unlinked.
    expect(unlinked).not.toContain(finalDb);
  });
});

describe('deleteAvatar', () => {
  it('unlinks the current avatar and clears it in the DB', async () => {
    currentAvatar = '/uploads/avatars/7-123.png';
    const res = mkRes();
    await deleteAvatar(mkReq(), res, vi.fn());
    expect(mockUnlink).toHaveBeenCalledTimes(1);
    expect(path.basename((mockUnlink.mock.calls[0][0] as string) ?? '')).toBe('7-123.png');
    expect(currentAvatar).toBeNull();
    expect(res.json).toHaveBeenCalledWith({ message: 'Avatar removed' });
  });

  it('is a no-op unlink when the user has no avatar', async () => {
    currentAvatar = null;
    const res = mkRes();
    await deleteAvatar(mkReq(), res, vi.fn());
    expect(mockUnlink).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Avatar removed' });
  });
});

describe('updateProfile', () => {
  const mkProfileReq = (body: Record<string, unknown>) =>
    ({ user: { id: 7 }, body }) as unknown as Request;

  it('trims bio to 200 chars and normalises empty bio to null', async () => {
    mockUpdateProfile.mockResolvedValueOnce(undefined);
    const long = 'x'.repeat(500);
    await updateProfile(mkProfileReq({ bio: long }), mkRes(), vi.fn());
    expect(mockUpdateProfile).toHaveBeenCalledWith(7, { bio: 'x'.repeat(200) });

    mockUpdateProfile.mockResolvedValueOnce(undefined);
    await updateProfile(mkProfileReq({ bio: '' }), mkRes(), vi.fn());
    expect(mockUpdateProfile).toHaveBeenLastCalledWith(7, { bio: null });
  });

  it('sets a 24h expiry when status is provided, clears when empty', async () => {
    mockUpdateProfile.mockResolvedValueOnce(undefined);
    await updateProfile(mkProfileReq({ status: 'hacking' }), mkRes(), vi.fn());
    const call = mockUpdateProfile.mock.calls.at(-1)![1] as {
      status: string;
      statusExpiresAt: Date;
    };
    expect(call.status).toBe('hacking');
    expect(call.statusExpiresAt).toBeInstanceOf(Date);

    mockUpdateProfile.mockResolvedValueOnce(undefined);
    await updateProfile(mkProfileReq({ status: '' }), mkRes(), vi.fn());
    expect(mockUpdateProfile).toHaveBeenLastCalledWith(7, {
      status: null,
      statusExpiresAt: null,
    });
  });

  it('sends nothing when neither bio nor status is present', async () => {
    mockUpdateProfile.mockResolvedValueOnce(undefined);
    const res = mkRes();
    await updateProfile(mkProfileReq({}), res, vi.fn());
    expect(mockUpdateProfile).toHaveBeenCalledWith(7, {});
    expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated' });
  });

  it('persists the privacy flags when provided', async () => {
    mockUpdateProfile.mockResolvedValueOnce(undefined);
    await updateProfile(
      mkProfileReq({
        showBio: false,
        showStats: true,
        showProgress: false,
        showActivity: true,
        showConnections: false,
      }),
      mkRes(),
      vi.fn(),
    );
    expect(mockUpdateProfile).toHaveBeenLastCalledWith(7, {
      showBio: false,
      showStats: true,
      showProgress: false,
      showActivity: true,
      showConnections: false,
    });
  });

  it('forwards repository errors to next', async () => {
    const boom = new Error('db down');
    mockUpdateProfile.mockRejectedValueOnce(boom);
    const next = vi.fn();
    await updateProfile(mkProfileReq({ bio: 'hi' }), mkRes(), next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('changePassword', () => {
  const mkPwReq = (body: Record<string, unknown>) =>
    ({ user: { id: 7 }, body }) as unknown as Request;

  it('rejects with 404 when the user cannot be found', async () => {
    mockFindByIdWithPassword.mockResolvedValueOnce(null);
    const next = vi.fn();
    await changePassword(mkPwReq({ currentPassword: 'a', newPassword: 'b' }), mkRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('rejects with 401 when the current password does not match', async () => {
    const { default: bcrypt } = await import('bcryptjs');
    const hash = bcrypt.hashSync('right-password', 4);
    mockFindByIdWithPassword.mockResolvedValueOnce({ password: hash });
    const next = vi.fn();
    await changePassword(
      mkPwReq({ currentPassword: 'wrong', newPassword: 'new-one' }),
      mkRes(),
      next,
    );
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(401);
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('hashes and persists the new password on success', async () => {
    const { default: bcrypt } = await import('bcryptjs');
    const hash = bcrypt.hashSync('right', 4);
    mockFindByIdWithPassword.mockResolvedValueOnce({ password: hash });
    mockUpdatePassword.mockResolvedValueOnce(undefined);
    const res = mkRes();
    await changePassword(
      mkPwReq({ currentPassword: 'right', newPassword: 'freshpass' }),
      res,
      vi.fn(),
    );
    expect(mockUpdatePassword).toHaveBeenCalledTimes(1);
    const [id, storedHash] = mockUpdatePassword.mock.calls[0] as [number, string];
    expect(id).toBe(7);
    expect(bcrypt.compareSync('freshpass', storedHash)).toBe(true);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password updated' });
  });

  it('forwards unexpected errors to next', async () => {
    const boom = new Error('db failure');
    mockFindByIdWithPassword.mockRejectedValueOnce(boom);
    const next = vi.fn();
    await changePassword(mkPwReq({ currentPassword: 'a', newPassword: 'b' }), mkRes(), next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('getActivity', () => {
  const mkActivityReq = () => ({ user: { id: 7 } }) as unknown as Request;

  const utcDay = (offsetDays: number): Date => {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - offsetDays * 86_400_000,
    );
  };

  it('returns streak 0 and null lastActiveAt when there is no activity', async () => {
    mockGetActivityDates.mockResolvedValueOnce([]);
    const res = mkRes();
    await getActivity(mkActivityReq(), res, vi.fn());
    expect(res.json).toHaveBeenCalledWith({ streak: 0, lastActiveAt: null });
  });

  it('counts consecutive days ending today as the streak', async () => {
    const today = utcDay(0);
    const y = utcDay(1);
    const d2 = utcDay(2);
    mockGetActivityDates.mockResolvedValueOnce([
      { completedAt: today, lastAccessedAt: today },
      { completedAt: y, lastAccessedAt: y },
      { completedAt: d2, lastAccessedAt: d2 },
    ]);
    const res = mkRes();
    await getActivity(mkActivityReq(), res, vi.fn());
    const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0] as {
      streak: number;
      lastActiveAt: string;
    };
    expect(payload.streak).toBe(3);
    expect(payload.lastActiveAt).toBe(today.toISOString());
  });

  it('still counts a streak when the most recent day is yesterday', async () => {
    const y = utcDay(1);
    const d2 = utcDay(2);
    mockGetActivityDates.mockResolvedValueOnce([
      { completedAt: y, lastAccessedAt: y },
      { completedAt: d2, lastAccessedAt: d2 },
    ]);
    const res = mkRes();
    await getActivity(mkActivityReq(), res, vi.fn());
    const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0] as { streak: number };
    expect(payload.streak).toBe(2);
  });

  it('breaks the streak when there is a day gap', async () => {
    const today = utcDay(0);
    const three = utcDay(3);
    mockGetActivityDates.mockResolvedValueOnce([
      { completedAt: today, lastAccessedAt: today },
      { completedAt: three, lastAccessedAt: three },
    ]);
    const res = mkRes();
    await getActivity(mkActivityReq(), res, vi.fn());
    const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0] as { streak: number };
    expect(payload.streak).toBe(1);
  });

  it('returns streak 0 when last activity is older than yesterday', async () => {
    const three = utcDay(3);
    mockGetActivityDates.mockResolvedValueOnce([{ completedAt: three, lastAccessedAt: three }]);
    const res = mkRes();
    await getActivity(mkActivityReq(), res, vi.fn());
    const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0] as { streak: number };
    expect(payload.streak).toBe(0);
  });

  it('ignores rows with no completedAt but still tracks lastAccessedAt', async () => {
    const today = utcDay(0);
    const older = utcDay(5);
    mockGetActivityDates.mockResolvedValueOnce([
      { completedAt: null, lastAccessedAt: today },
      { completedAt: null, lastAccessedAt: older },
      { completedAt: null, lastAccessedAt: null },
    ]);
    const res = mkRes();
    await getActivity(mkActivityReq(), res, vi.fn());
    expect(res.json).toHaveBeenCalledWith({ streak: 0, lastActiveAt: today.toISOString() });
  });

  it('forwards repository errors to next', async () => {
    const boom = new Error('db down');
    mockGetActivityDates.mockRejectedValueOnce(boom);
    const next = vi.fn();
    await getActivity(mkActivityReq(), mkRes(), next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('requestEmailChange', () => {
  const mkReq = (body: Record<string, unknown>) =>
    ({ user: { id: 7 }, body }) as unknown as Request;

  it('rejects with 404 when user cannot be found', async () => {
    mockFindByIdWithPassword.mockResolvedValueOnce(null);
    const next = vi.fn();
    await requestEmailChange(mkReq({ currentPassword: 'a', newEmail: 'new@t.com' }), mkRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
    expect(mockSetPendingEmailChange).not.toHaveBeenCalled();
  });

  it('rejects with 401 when password is wrong', async () => {
    const { default: bcrypt } = await import('bcryptjs');
    mockFindByIdWithPassword.mockResolvedValueOnce({ password: bcrypt.hashSync('right', 4) });
    const next = vi.fn();
    await requestEmailChange(
      mkReq({ currentPassword: 'wrong', newEmail: 'new@t.com' }),
      mkRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(401);
    expect(mockSetPendingEmailChange).not.toHaveBeenCalled();
  });

  it('rejects with 400 when the new email equals the current one', async () => {
    const { default: bcrypt } = await import('bcryptjs');
    mockFindByIdWithPassword.mockResolvedValueOnce({ password: bcrypt.hashSync('right', 4) });
    mockFindById.mockResolvedValueOnce({ email: 'Same@t.com' });
    const next = vi.fn();
    await requestEmailChange(
      mkReq({ currentPassword: 'right', newEmail: 'SAME@t.com' }),
      mkRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
    expect(mockSetPendingEmailChange).not.toHaveBeenCalled();
  });

  it('rejects with 409 when the new email is already in use', async () => {
    const { default: bcrypt } = await import('bcryptjs');
    mockFindByIdWithPassword.mockResolvedValueOnce({ password: bcrypt.hashSync('right', 4) });
    mockFindById.mockResolvedValueOnce({ email: 'me@t.com' });
    mockFindByEmail.mockResolvedValueOnce({ id: 42 });
    const next = vi.fn();
    await requestEmailChange(
      mkReq({ currentPassword: 'right', newEmail: 'taken@t.com' }),
      mkRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(409);
    expect(mockSetPendingEmailChange).not.toHaveBeenCalled();
  });

  it('stores a normalised pending email and sends a 6-digit code', async () => {
    const { default: bcrypt } = await import('bcryptjs');
    mockFindByIdWithPassword.mockResolvedValueOnce({ password: bcrypt.hashSync('right', 4) });
    mockFindById.mockResolvedValueOnce({ email: 'old@t.com' });
    mockFindByEmail.mockResolvedValueOnce(null);
    mockSetPendingEmailChange.mockResolvedValueOnce(undefined);
    mockSendEmailChangeCode.mockResolvedValueOnce(undefined);

    const res = mkRes();
    await requestEmailChange(
      mkReq({ currentPassword: 'right', newEmail: '  New@t.COM  ' }),
      res,
      vi.fn(),
    );

    expect(mockSetPendingEmailChange).toHaveBeenCalledTimes(1);
    const [uid, email, code, expiresAt] = mockSetPendingEmailChange.mock.calls[0] as [
      number,
      string,
      string,
      Date,
    ];
    expect(uid).toBe(7);
    expect(email).toBe('new@t.com');
    expect(code).toMatch(/^\d{6}$/);
    expect(expiresAt).toBeInstanceOf(Date);
    expect(mockSendEmailChangeCode).toHaveBeenCalledWith('new@t.com', code);
    expect(res.json).toHaveBeenCalledWith({ message: 'Confirmation code sent' });
  });

  it('still resolves 200 when SMTP send fails asynchronously', async () => {
    const { default: bcrypt } = await import('bcryptjs');
    mockFindByIdWithPassword.mockResolvedValueOnce({ password: bcrypt.hashSync('right', 4) });
    mockFindById.mockResolvedValueOnce({ email: 'old@t.com' });
    mockFindByEmail.mockResolvedValueOnce(null);
    mockSetPendingEmailChange.mockResolvedValueOnce(undefined);
    mockSendEmailChangeCode.mockRejectedValueOnce(new Error('smtp down'));
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = mkRes();
    await requestEmailChange(
      mkReq({ currentPassword: 'right', newEmail: 'new@t.com' }),
      res,
      vi.fn(),
    );
    // Give the fire-and-forget send() catch() handler a tick to run.
    await new Promise((r) => setImmediate(r));
    expect(res.json).toHaveBeenCalledWith({ message: 'Confirmation code sent' });
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('forwards unexpected errors to next', async () => {
    const boom = new Error('db down');
    mockFindByIdWithPassword.mockRejectedValueOnce(boom);
    const next = vi.fn();
    await requestEmailChange(mkReq({ currentPassword: 'a', newEmail: 'b@t.com' }), mkRes(), next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('confirmEmailChange', () => {
  const mkReq = (body: Record<string, unknown>) =>
    ({ user: { id: 7 }, body }) as unknown as Request;

  it('rejects with 400 when there is no pending change', async () => {
    mockFindPendingEmailChange.mockResolvedValueOnce(null);
    const next = vi.fn();
    await confirmEmailChange(mkReq({ code: '123456' }), mkRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('rejects with 400 when the code has expired', async () => {
    mockFindPendingEmailChange.mockResolvedValueOnce({
      pendingEmail: 'new@t.com',
      emailChangeCode: '123456',
      emailChangeCodeExpiresAt: new Date('2000-01-01T00:00:00Z'),
    });
    const next = vi.fn();
    await confirmEmailChange(mkReq({ code: '123456' }), mkRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
    expect(mockApplyPendingEmailChange).not.toHaveBeenCalled();
  });

  it('rejects with 400 when the code does not match', async () => {
    mockFindPendingEmailChange.mockResolvedValueOnce({
      pendingEmail: 'new@t.com',
      emailChangeCode: '123456',
      emailChangeCodeExpiresAt: new Date('2999-12-31T23:59:59Z'),
    });
    const next = vi.fn();
    await confirmEmailChange(mkReq({ code: '999999' }), mkRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
    expect(mockApplyPendingEmailChange).not.toHaveBeenCalled();
  });

  it('clears the pending change and rejects 409 when someone else took the email', async () => {
    mockFindPendingEmailChange.mockResolvedValueOnce({
      pendingEmail: 'race@t.com',
      emailChangeCode: '123456',
      emailChangeCodeExpiresAt: new Date('2999-12-31T23:59:59Z'),
    });
    mockFindByEmail.mockResolvedValueOnce({ id: 99 });
    mockClearPendingEmailChange.mockResolvedValueOnce(undefined);
    const next = vi.fn();
    await confirmEmailChange(mkReq({ code: '123456' }), mkRes(), next);
    expect(mockClearPendingEmailChange).toHaveBeenCalledWith(7);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(409);
    expect(mockApplyPendingEmailChange).not.toHaveBeenCalled();
  });

  it('applies the change and returns the new email on success', async () => {
    mockFindPendingEmailChange.mockResolvedValueOnce({
      pendingEmail: 'new@t.com',
      emailChangeCode: '123456',
      emailChangeCodeExpiresAt: new Date('2999-12-31T23:59:59Z'),
    });
    mockFindByEmail.mockResolvedValueOnce(null);
    mockApplyPendingEmailChange.mockResolvedValueOnce(undefined);
    const res = mkRes();
    await confirmEmailChange(mkReq({ code: '123456' }), res, vi.fn());
    expect(mockApplyPendingEmailChange).toHaveBeenCalledWith(7, 'new@t.com');
    expect(res.json).toHaveBeenCalledWith({ message: 'Email updated', email: 'new@t.com' });
  });

  it('treats a stale row owned by the same user as a no-op collision', async () => {
    mockFindPendingEmailChange.mockResolvedValueOnce({
      pendingEmail: 'same@t.com',
      emailChangeCode: '123456',
      emailChangeCodeExpiresAt: new Date('2999-12-31T23:59:59Z'),
    });
    mockFindByEmail.mockResolvedValueOnce({ id: 7 });
    mockApplyPendingEmailChange.mockResolvedValueOnce(undefined);
    const res = mkRes();
    await confirmEmailChange(mkReq({ code: '123456' }), res, vi.fn());
    // Same-user match is not a conflict; the apply still runs (idempotent).
    expect(mockApplyPendingEmailChange).toHaveBeenCalledWith(7, 'same@t.com');
    expect(res.json).toHaveBeenCalledWith({ message: 'Email updated', email: 'same@t.com' });
  });

  it('forwards unexpected errors to next', async () => {
    const boom = new Error('db down');
    mockFindPendingEmailChange.mockRejectedValueOnce(boom);
    const next = vi.fn();
    await confirmEmailChange(mkReq({ code: '123456' }), mkRes(), next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('cancelEmailChange', () => {
  const mkReq = () => ({ user: { id: 7 } }) as unknown as Request;

  it('clears the pending change', async () => {
    mockClearPendingEmailChange.mockResolvedValueOnce(undefined);
    const res = mkRes();
    await cancelEmailChange(mkReq(), res, vi.fn());
    expect(mockClearPendingEmailChange).toHaveBeenCalledWith(7);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pending email change cancelled' });
  });

  it('forwards unexpected errors to next', async () => {
    const boom = new Error('db down');
    mockClearPendingEmailChange.mockRejectedValueOnce(boom);
    const next = vi.fn();
    await cancelEmailChange(mkReq(), mkRes(), next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});
