import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import * as userRepo from "../repositories/user.repository.js";
import type { TokenPayload, AuthenticatedUser } from "../../shared/auth.js";
import { AppError } from "../middleware/errorHandler.js";

export async function signup(name: string, email: string, password: string): Promise<string> {
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const userId = await userRepo.create(name, email, hashedPassword);
    return createToken(userId);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      throw new AppError(409, "User already exists");
    }
    throw err;
  }
}

export async function login(email: string, password: string): Promise<string> {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError(401, "User not found");
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    throw new AppError(401, "Invalid password");
  }

  return createToken(user.id);
}

export async function getUser(userId: number): Promise<AuthenticatedUser> {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}

function createToken(userId: number): string {
  return jwt.sign({ id: userId } satisfies TokenPayload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}
