import type { Request, Response } from 'express';
import { webLessonStart } from '../services/web-start.service.js';

export async function getWebLessonStart(req: Request, res: Response): Promise<void> {
  const courseKey = req.params.courseKey as string;
  const lessonSlug = req.params.lessonSlug as string;
  const lang = req.query.lang === 'ro' ? 'ro' : 'en';
  res.json(await webLessonStart(req.user?.id ?? null, courseKey, lessonSlug, lang));
}
