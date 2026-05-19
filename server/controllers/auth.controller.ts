import type { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";
import * as authService from "../services/auth.service.js";

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body;
    const token = await authService.signup(name, email, password);
    res.cookie("token", token, config.cookie);
    res.json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.cookie("token", token, config.cookie);
    res.json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getUser(req.user!.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
