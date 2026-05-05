import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.issues[0];
        res.status(400).json({
          error: first?.message ?? "Invalid request body",
          issues: err.issues.map(i => ({ path: i.path.join("."), message: i.message })),
        });
        return;
      }
      next(err);
    }
  };
}
