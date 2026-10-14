import type { Request, Response, NextFunction } from 'express';
import type { TutorReply } from '@cyberstars/shared/tutor';
import { askTutor } from '../services/tutor.service.js';
import * as userRepo from '../repositories/user.repository.js';

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    // The role decides which pages the tutor may point to, read fresh like
    // every other role check.
    const role = await userRepo.getRole(req.user!.id);
    const answer = await askTutor({
      message: req.body.message,
      page: req.body.page,
      uiLang: req.body.lang === 'ro' ? 'ro' : 'en',
      role,
      isProd: process.env.NODE_ENV === 'production',
    });
    const reply: TutorReply = { answer };
    res.json(reply);
  } catch (err) {
    next(err);
  }
}
