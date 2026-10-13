import type { Request, Response, NextFunction } from 'express';
import * as userRepo from '../repositories/user.repository.js';
import { isAdmin } from '@cyberstars/shared/auth';
import { consume, getSummary } from '../services/usage.service.js';
import { contentDir, readLocalized } from '../services/paths.js';
import { AppError } from '../middleware/errorHandler.js';
import type { SolutionReveal } from '@cyberstars/shared/usage';

// Lesson slugs are lowercase words joined by dashes; anything else (a `..` or an
// encoded `/`) would let the slug walk out of the course directory.
const LESSON_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function getUsage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const admin = isAdmin(await userRepo.getRole(userId));
    res.json(getSummary(userId, admin));
  } catch (err) {
    next(err);
  }
}

// Reveals a lesson's solution and records it against the daily Show Solution
// cap (429 once hit). Solution files stay on the server (the static-content
// generator never publishes them), so this is the only way to read one, and only
// for signed-in students. A lesson without a solution is a 404 and costs nothing.
export async function revealSolution(req: Request, res: Response, next: NextFunction) {
  try {
    const courseKey = req.params.courseKey as string;
    const lessonSlug = req.params.lessonSlug as string;
    const lang = req.body.lang === 'ro' ? 'ro' : 'en';
    const solution = LESSON_SLUG.test(lessonSlug)
      ? readLocalized(contentDir(courseKey), `${lessonSlug}-solution.md`, lang)
      : '';
    if (!solution) throw new AppError(404, 'Solution not found');

    const userId = req.user!.id;
    const admin = isAdmin(await userRepo.getRole(userId));
    const reveal: SolutionReveal = { solution, usage: consume(userId, 'showSolution', admin) };
    res.json(reveal);
  } catch (err) {
    next(err);
  }
}
