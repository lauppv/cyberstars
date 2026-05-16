import { prisma } from "../config/db.js";
import type { User, Role } from "@prisma/client";

export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true, bio: true, status: true, statusExpiresAt: true },
  });
}

export async function updateProfile(id: number, data: { bio?: string | null; status?: string | null; statusExpiresAt?: Date | null; avatarUrl?: string | null }) {
  await prisma.user.update({ where: { id }, data });
}

export async function getRole(id: number): Promise<Role> {
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  return user?.role ?? "USER";
}

export async function create(name: string, email: string, hashedPassword: string): Promise<number> {
  // The very first account to register bootstraps the platform as ADMIN.
  const existing = await prisma.user.count();
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: existing === 0 ? "ADMIN" : "USER" },
    select: { id: true },
  });
  return user.id;
}

export async function updateRole(id: number, role: Role): Promise<void> {
  await prisma.user.update({ where: { id }, data: { role } });
}
