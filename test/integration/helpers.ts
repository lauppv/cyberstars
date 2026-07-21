import request from 'supertest';
import { app } from '../../server/app.js';
import { prisma } from '../../server/config/db.js';

let counter = 0;

// Resolve a signed-up user's DB id from the email createAuthenticatedAgent
// returns — needed when a test must act on ids the API only exposes indirectly.
export async function userIdFor(email: string): Promise<number> {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  return user.id;
}

export function agent() {
  return request.agent(app);
}

export async function createAuthenticatedAgent(overrides?: {
  name?: string;
  email?: string;
  password?: string;
}) {
  const a = agent();
  const name = overrides?.name ?? `User${++counter}`;
  const email = overrides?.email ?? `user${counter}@test.com`;
  const password = overrides?.password ?? 'password123';

  const res = await a.post('/auth/signup').send({ name, email, password }).expect(200);

  return { agent: a, name, email, password, res };
}
