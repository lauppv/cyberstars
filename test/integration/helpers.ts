import request from 'supertest';
import { app } from '../../server/app.js';

let counter = 0;

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
