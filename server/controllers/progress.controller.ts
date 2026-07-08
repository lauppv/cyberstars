import type { Request, Response } from 'express';
import * as progressService from '../services/progress.service.js';

export async function getCourseProgress(req: Request, res: Response): Promise<void> {
  const courseKey = req.params.courseKey as string;
  const progress = await progressService.getCourseProgress(req.user!.id, courseKey);
  res.json(progress);
}

export async function markComplete(req: Request, res: Response): Promise<void> {
  const courseKey = req.params.courseKey as string;
  const lessonSlug = req.params.lessonSlug as string;
  await progressService.markComplete(req.user!.id, courseKey, lessonSlug);
  res.json({ message: 'Lesson marked as complete' });
}

export async function markIncomplete(req: Request, res: Response): Promise<void> {
  const courseKey = req.params.courseKey as string;
  const lessonSlug = req.params.lessonSlug as string;
  await progressService.markIncomplete(req.user!.id, courseKey, lessonSlug);
  res.json({ message: 'Lesson marked as incomplete' });
}

export async function getSavedCode(req: Request, res: Response): Promise<void> {
  const courseKey = req.params.courseKey as string;
  const lessonSlug = req.params.lessonSlug as string;
  const code = await progressService.getSavedCode(req.user!.id, courseKey, lessonSlug);
  res.json({ code });
}

export async function saveCode(req: Request, res: Response): Promise<void> {
  const courseKey = req.params.courseKey as string;
  const lessonSlug = req.params.lessonSlug as string;
  const { code } = req.body;
  await progressService.saveCode(req.user!.id, courseKey, lessonSlug, code);
  res.json({ message: 'Code saved' });
}

export async function trackAccess(req: Request, res: Response): Promise<void> {
  const courseKey = req.params.courseKey as string;
  const lessonSlug = req.params.lessonSlug as string;
  await progressService.trackAccess(req.user!.id, courseKey, lessonSlug);
  res.json({ message: 'Access tracked' });
}
