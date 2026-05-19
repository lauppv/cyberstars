import type { Request, Response, NextFunction } from "express";
import * as lessonService from "../services/lesson.service.js";

export function getLesson(req: Request, res: Response, next: NextFunction): void {
  try {
    const lang = req.params.lang as string;
    const lesson = req.params.lesson as string;
    const content = lessonService.getLessonContent(lang, lesson);
    res.json(content);
  } catch (err) {
    next(err);
  }
}

export function getLessonCode(req: Request, res: Response, next: NextFunction): void {
  try {
    const lang = req.params.lang as string;
    const file = req.params.file as string;
    const code = lessonService.getLessonCode(lang, file);
    res.type("text/plain").send(code);
  } catch (err) {
    next(err);
  }
}

export async function getCurriculum(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const curriculum = await lessonService.getCurriculum();
    res.json(curriculum);
  } catch (err) {
    next(err);
  }
}
