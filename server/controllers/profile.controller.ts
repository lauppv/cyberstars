import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'node:crypto';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import { fileTypeFromBuffer } from 'file-type';
import * as userRepo from '../repositories/user.repository.js';
import * as progressRepo from '../repositories/progress.repository.js';
import * as emailService from '../services/email.service.js';
import { computeStreak } from '../services/activity.service.js';
import { AppError } from '../middleware/errorHandler.js';

const UPLOAD_DIR = path.resolve('uploads/avatars');

// Create the upload dir lazily on first use instead of at import time, so the
// module imports without filesystem side effects (audit H9). Cached so the
// mkdir runs at most once.
let uploadDirReady: Promise<void> | null = null;
function ensureUploadDir(): Promise<void> {
  if (!uploadDirReady) uploadDirReady = fs.mkdir(UPLOAD_DIR, { recursive: true }).then(() => {});
  return uploadDirReady;
}

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// Serialize avatar mutations per user. Concurrent upload/delete requests for
// the same user otherwise read the same previous avatarUrl and leave the
// loser's file orphaned on disk (audit H10).
const avatarLocks = new Map<number, Promise<unknown>>();

function withAvatarLock<T>(userId: number, task: () => Promise<T>): Promise<T> {
  const prev = avatarLocks.get(userId) ?? Promise.resolve();
  const run = prev.then(task, task);
  const tail = run.then(
    () => {},
    () => {},
  );
  avatarLocks.set(userId, tail);
  void tail.then(() => {
    if (avatarLocks.get(userId) === tail) avatarLocks.delete(userId);
  });
  return run;
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { bio, status, showBio, showStats, showProgress } = req.body;

    const data: {
      bio?: string | null;
      status?: string | null;
      statusExpiresAt?: Date | null;
      showBio?: boolean;
      showStats?: boolean;
      showProgress?: boolean;
    } = {};

    if (bio !== undefined) {
      data.bio = bio ? String(bio).slice(0, 200) : null;
    }

    if (status !== undefined) {
      if (status) {
        data.status = String(status).slice(0, 80);
        data.statusExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      } else {
        data.status = null;
        data.statusExpiresAt = null;
      }
    }

    if (showBio !== undefined) data.showBio = showBio;
    if (showStats !== undefined) data.showStats = showStats;
    if (showProgress !== undefined) data.showProgress = showProgress;

    await userRepo.updateProfile(userId, data);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const file = req.file;
    if (!file) throw new AppError(400, 'No file uploaded');

    const type = await fileTypeFromBuffer(file.buffer);
    if (!type || !ALLOWED_MIMES.has(type.mime)) {
      throw new AppError(400, 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    const avatarUrl = await withAvatarLock(userId, async () => {
      const ext = type.ext;
      const filename = `${userId}-${Date.now()}.${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      const user = await userRepo.findById(userId);
      if (user?.avatarUrl) {
        const oldFile = path.join(UPLOAD_DIR, path.basename(user.avatarUrl));
        await fs.unlink(oldFile).catch(() => {});
      }

      await ensureUploadDir();
      await fs.writeFile(filepath, file.buffer);
      const url = `/uploads/avatars/${filename}`;
      await userRepo.updateProfile(userId, { avatarUrl: url });
      return url;
    });

    res.json({ avatarUrl });
  } catch (err) {
    next(err);
  }
}

export async function deleteAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    await withAvatarLock(userId, async () => {
      const user = await userRepo.findById(userId);
      if (user?.avatarUrl) {
        const oldFile = path.join(UPLOAD_DIR, path.basename(user.avatarUrl));
        await fs.unlink(oldFile).catch(() => {});
      }
      await userRepo.updateProfile(userId, { avatarUrl: null });
    });
    res.json({ message: 'Avatar removed' });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    const user = await userRepo.findByIdWithPassword(userId);
    if (!user) throw new AppError(404, 'User not found');

    const valid = bcrypt.compareSync(currentPassword, user.password);
    if (!valid) throw new AppError(401, 'Current password is incorrect');

    const hashed = bcrypt.hashSync(newPassword, 10);
    await userRepo.updatePassword(userId, hashed);
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

export async function requestEmailChange(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { currentPassword, newEmail } = req.body as { currentPassword: string; newEmail: string };
    const normalized = newEmail.toLowerCase().trim();

    const user = await userRepo.findByIdWithPassword(userId);
    if (!user) throw new AppError(404, 'User not found');

    const valid = bcrypt.compareSync(currentPassword, user.password);
    if (!valid) throw new AppError(401, 'Current password is incorrect');

    const current = await userRepo.findById(userId);
    if (current && current.email.toLowerCase() === normalized) {
      throw new AppError(400, 'New email is the same as the current one');
    }

    const existing = await userRepo.findByEmail(normalized);
    if (existing) throw new AppError(409, 'Email is already in use');

    const code = crypto.randomInt(100_000, 999_999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await userRepo.setPendingEmailChange(userId, normalized, code, expiresAt);

    // Send outside the request path, same pattern as forgot-password: keep
    // response timing insensitive to mail latency and don't 500 the request if
    // the provider is down — the code is already persisted.
    void emailService.sendEmailChangeCode(normalized, code).catch((err) => {
      console.error('[email-change] failed to send confirmation code:', err);
    });

    res.json({ message: 'Confirmation code sent' });
  } catch (err) {
    next(err);
  }
}

export async function confirmEmailChange(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { code } = req.body as { code: string };

    const pending = await userRepo.findPendingEmailChange(userId);
    if (!pending) throw new AppError(400, 'No pending email change');
    if (pending.emailChangeCodeExpiresAt < new Date() || pending.emailChangeCode !== code) {
      throw new AppError(400, 'Invalid or expired code');
    }

    // Re-check uniqueness at commit time: someone else may have registered the
    // pending address between request and confirm.
    const existing = await userRepo.findByEmail(pending.pendingEmail);
    if (existing && existing.id !== userId) {
      await userRepo.clearPendingEmailChange(userId);
      throw new AppError(409, 'Email is already in use');
    }

    await userRepo.applyPendingEmailChange(userId, pending.pendingEmail);
    res.json({ message: 'Email updated', email: pending.pendingEmail });
  } catch (err) {
    next(err);
  }
}

export async function cancelEmailChange(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    await userRepo.clearPendingEmailChange(userId);
    res.json({ message: 'Pending email change cancelled' });
  } catch (err) {
    next(err);
  }
}

export async function getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const rows = await progressRepo.getActivityDates(userId);

    let lastActiveAt: Date | null = null;
    for (const r of rows) {
      if (r.lastAccessedAt && (!lastActiveAt || r.lastAccessedAt > lastActiveAt)) {
        lastActiveAt = r.lastAccessedAt;
      }
    }

    res.json({
      streak: computeStreak(rows),
      lastActiveAt: lastActiveAt?.toISOString() ?? null,
    });
  } catch (err) {
    next(err);
  }
}
