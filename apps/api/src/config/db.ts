import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

function buildDatabaseUrl(): string {
  if (env.db.url) return env.db.url;
  const { user, password, host, port, database } = env.db;
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

export const prisma = new PrismaClient({
  datasources: { db: { url: buildDatabaseUrl() } },
});
