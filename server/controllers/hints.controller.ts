import type { Request, Response, NextFunction } from 'express';
import { generateHint } from '../services/hints.service.js';
import { consume, getState } from '../services/usage.service.js';
import * as userRepo from '../repositories/user.repository.js';
import { isAdmin } from '../../shared/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { HintLevel } from '../../shared/hints.js';

export async function getHint(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseKey, lessonSlug } = req.params;
    const lang = req.body.lang === 'ro' ? 'ro' : 'en';
    const userId = req.user!.id;
    const admin = isAdmin(await userRepo.getRole(userId));

    // Reject before spending a Gemini call when the daily budget is exhausted,
    // but only increment the counter after a hint actually comes back.
    if (getState(userId, 'getHint', admin).remaining <= 0) {
      throw new AppError(429, 'Daily hint limit reached');
    }

    const result = await generateHint(
      courseKey,
      lessonSlug,
      req.body.code,
      req.body.level as HintLevel,
      lang,
    );
    const usage = consume(userId, 'getHint', admin);
    res.json({ ...result, usage });
  } catch (err) {
    next(err);
  }
}
