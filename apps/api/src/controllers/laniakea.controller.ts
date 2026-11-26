import type { Request, Response, NextFunction } from 'express';
import * as laniakeaService from '../services/laniakea.service.js';
import * as recapsService from '../services/laniakea-recaps.service.js';

export async function getState(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await laniakeaService.getState(req.user!.id));
  } catch (err) {
    next(err);
  }
}

// The game page opened: reads the recap notification.
export async function markSeen(req: Request, res: Response, next: NextFunction) {
  try {
    await recapsService.markSeen(req.user!.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function startQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const lang = req.body.lang === 'ro' ? 'ro' : 'en';
    res.json(await laniakeaService.startQuiz(req.user!.id, req.params.slug as string, lang));
  } catch (err) {
    next(err);
  }
}

export async function answerQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const { index, choice } = req.body as { index: number; choice: number };
    res.json(
      await laniakeaService.answerQuiz(req.user!.id, req.params.slug as string, index, choice),
    );
  } catch (err) {
    next(err);
  }
}
