import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

function buildDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const { user, password, host, port, database } = env.db;
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

export const prisma = new PrismaClient({
  datasources: { db: { url: buildDatabaseUrl() } },
});
