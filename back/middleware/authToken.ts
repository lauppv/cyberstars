import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { TokenPayload } from "../types/auth.js";

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (token) {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
      req.user = payload;
    } catch {
      // Invalid token - continue without auth
    }
  }

  next();
}
