import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileTypeFromBuffer } from 'file-type';
import * as userRepo from '../repositories/user.repository.js';
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
