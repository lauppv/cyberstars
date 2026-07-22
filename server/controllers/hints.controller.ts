import type { Request, Response, NextFunction } from 'express';
import { generateHint } from '../services/hints.service.js';
import type { HintLevel } from '../../shared/hints.js';

export async function getHint(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseKey, lessonSlug } = req.params;
    const lang = req.body.lang === 'ro' ? 'ro' : 'en';
    const result = await generateHint(
      courseKey,
      lessonSlug,
      req.body.code,
      req.body.level as HintLevel,
      lang,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
