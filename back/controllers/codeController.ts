import type { Request, Response } from "express";
import * as codeService from "../services/codeExecutionService.js";

export async function executeCode(req: Request, res: Response): Promise<void> {
  const { code, language } = req.body;
  const output = await codeService.execute(code, language);
  res.json({ output });
}
