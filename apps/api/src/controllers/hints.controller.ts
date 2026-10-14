import type { Request, Response, NextFunction } from 'express';
import { generateHint } from '../services/hints.service.js';
import * as usage from '../services/usage.service.js';
import * as userRepo from '../repositories/user.repository.js';
import { isAdmin } from '@cyberstars/shared/auth';
import type { HintLevel } from '@cyberstars/shared/hints';

export async function getHint(req: Request, res: Response, next: NextFunction) {
  try {
    const courseKey = req.params.courseKey as string;
    const lessonSlug = req.params.lessonSlug as string;
    const lang = req.body.lang === 'ro' ? 'ro' : 'en';
    const userId = req.user!.id;
    const admin = isAdmin(await userRepo.getRole(userId));

    // The hint is taken from the day's budget before the Gemini call, so two
    // requests can't both spend the last one, and given back when none comes.
    const held = await usage.hold(userId, 'getHint', admin);
    let result;
    try {
      result = await generateHint(
        courseKey,
        lessonSlug,
        req.body.code,
        req.body.level as HintLevel,
        lang,
      );
    } catch (err) {
      await usage.release(held, 1);
      throw err;
    }
    const summary = await usage.getSummary(userId, admin);
    res.json({ ...result, usage: summary });
  } catch (err) {
    next(err);
  }
}
