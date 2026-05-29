import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import type { Request, Response } from 'express';

const { mockMkdir, mockWriteFile, mockUnlink, mockFindById, mockUpdateProfile, mockFileType } =
  vi.hoisted(() => ({
    mockMkdir: vi.fn(),
    mockWriteFile: vi.fn(),
    mockUnlink: vi.fn(),
    mockFindById: vi.fn(),
    mockUpdateProfile: vi.fn(),
    mockFileType: vi.fn(),
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
}));

const { uploadAvatar, deleteAvatar } = await import('./profile.controller.js');

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
