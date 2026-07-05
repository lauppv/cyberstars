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
}));

// progress.repository pulls in db.ts -> env.ts (requires JWT_SECRET). Stub it
// so the controller module can import in envs without a full .env (e.g. CI).
vi.mock('../repositories/progress.repository.js', () => ({
  getActivityDates: (...a: unknown[]) => mockGetActivityDates(...a),
}));

const { uploadAvatar, deleteAvatar, updateProfile, changePassword, getActivity } = await import(
  './profile.controller.js'
);

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
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
        offsetDays * 86_400_000,
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
