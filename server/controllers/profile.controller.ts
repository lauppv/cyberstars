import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import { fileTypeFromBuffer } from 'file-type';
import * as userRepo from '../repositories/user.repository.js';
import * as progressRepo from '../repositories/progress.repository.js';
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
    const { bio, status } = req.body;

    const data: { bio?: string | null; status?: string | null; statusExpiresAt?: Date | null } = {};

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

// Streak = consecutive days (ending at the most recent activity day) with at
// least one completed lesson. UTC-based day boundaries so timezone drift
// doesn't split a single session across two calendar days.
export async function getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const rows = await progressRepo.getActivityDates(userId);

    const days = new Set<number>();
    let lastActiveAt: Date | null = null;
    for (const r of rows) {
      if (r.lastAccessedAt && (!lastActiveAt || r.lastAccessedAt > lastActiveAt)) {
        lastActiveAt = r.lastAccessedAt;
      }
      if (r.completedAt) {
        const d = new Date(
          Date.UTC(
            r.completedAt.getUTCFullYear(),
            r.completedAt.getUTCMonth(),
            r.completedAt.getUTCDate(),
          ),
        );
        days.add(d.getTime());
      }
    }

    const MS_PER_DAY = 86_400_000;
    const sortedDays = [...days].sort((a, b) => b - a);
    let streak = 0;
    if (sortedDays.length > 0) {
      const today = Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
      );
      const mostRecent = sortedDays[0];
      // Start counting from the most recent activity day if it is today or
      // yesterday; if the last activity was older than yesterday, streak is 0.
      if (mostRecent === today || mostRecent === today - MS_PER_DAY) {
        streak = 1;
        for (let i = 1; i < sortedDays.length; i++) {
          if (sortedDays[i] === sortedDays[i - 1] - MS_PER_DAY) streak++;
          else break;
        }
      }
    }

    res.json({
      streak,
      lastActiveAt: lastActiveAt?.toISOString() ?? null,
    });
  } catch (err) {
    next(err);
  }
}
