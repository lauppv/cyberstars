import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { authenticateToken } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { updateProfileSchema } from "../schemas/profile.schema.js";
import * as userRepo from "../repositories/user.repository.js";
import { AppError } from "../middleware/errorHandler.js";

const UPLOAD_DIR = path.resolve("uploads/avatars");
await fs.mkdir(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
});

const router = Router();

router.patch("/", authenticateToken, validateBody(updateProfileSchema), async (req, res, next) => {
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
    res.json({ message: "Profile updated" });
  } catch (err) {
    next(err);
  }
});

router.post("/avatar", authenticateToken, upload.single("avatar"), async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const file = req.file;
    if (!file) throw new AppError(400, "No file uploaded");

    const type = await fileTypeFromBuffer(file.buffer);
    if (!type || !ALLOWED_MIMES.has(type.mime)) {
      throw new AppError(400, "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
    }

    const ext = type.ext;
    const filename = `${userId}-${Date.now()}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const user = await userRepo.findById(userId);
    if (user?.avatarUrl) {
      const oldFile = path.join(UPLOAD_DIR, path.basename(user.avatarUrl));
      await fs.unlink(oldFile).catch(() => {});
    }

    await fs.writeFile(filepath, file.buffer);
    const avatarUrl = `/uploads/avatars/${filename}`;
    await userRepo.updateProfile(userId, { avatarUrl });
    res.json({ avatarUrl });
  } catch (err) {
    next(err);
  }
});

router.delete("/avatar", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const user = await userRepo.findById(userId);
    if (user?.avatarUrl) {
      const oldFile = path.join(UPLOAD_DIR, path.basename(user.avatarUrl));
      await fs.unlink(oldFile).catch(() => {});
    }
    await userRepo.updateProfile(userId, { avatarUrl: null });
    res.json({ message: "Avatar removed" });
  } catch (err) {
    next(err);
  }
});

export default router;
