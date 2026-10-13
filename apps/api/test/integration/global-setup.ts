import { execSync } from 'child_process';
import path from 'path';

// Prisma's CLI finds its config only from the API's own folder
const API_DIR = path.resolve(import.meta.dirname, '../..');

export function setup() {
  execSync('npx prisma migrate deploy', { cwd: API_DIR, stdio: 'inherit' });
  execSync('npx tsx prisma/seed.ts', { cwd: API_DIR, stdio: 'inherit' });
}
