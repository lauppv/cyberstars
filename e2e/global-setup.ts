import { execSync } from 'child_process';

export default function globalSetup() {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
}
