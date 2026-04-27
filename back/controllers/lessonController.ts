import type { Request, Response } from "express";
import * as lessonService from "../services/lessonService.js";

export function getLesson(req: Request, res: Response): void {
  const lang = req.params.lang as string;
  const lesson = req.params.lesson as string;
  const content = lessonService.getLessonContent(lang, lesson);
  res.json(content);
}

export function getLessonCode(req: Request, res: Response): void {
  const lang = req.params.lang as string;
  const file = req.params.file as string;
  const code = lessonService.getLessonCode(lang, file);
  res.type("text/plain").send(code);
}

export async function getCurriculum(_req: Request, res: Response): Promise<void> {
  const curriculum = await lessonService.getCurriculum();
  res.json(curriculum);
}
