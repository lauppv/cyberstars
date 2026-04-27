import type { Request, Response } from "express";
import { config } from "../config.js";
import * as authService from "../services/authService.js";

export async function signup(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;
  const token = await authService.signup(name, email, password);
  res.cookie("token", token, config.cookie);
  res.json({ message: "User created successfully" });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  res.cookie("token", token, config.cookie);
  res.json({ message: "Login successful" });
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await authService.getUser(req.user!.id);
  res.json(user);
}
