import { prisma } from "../config/db.js";
import type { User } from "@prisma/client";

export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });
}

export async function create(name: string, email: string, hashedPassword: string): Promise<number> {
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true },
  });
  return user.id;
}
