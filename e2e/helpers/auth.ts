import type { APIRequestContext } from '@playwright/test';
import { markOnboarded } from './db.js';

let counter = 0;

export function resetCounter() {
  counter = 0;
}

export async function signupViaAPI(
  request: APIRequestContext,
  overrides?: { name?: string; email?: string; password?: string },
) {
  const name = overrides?.name ?? `E2EUser${++counter}_${Date.now()}`;
  const email = overrides?.email ?? `${name.toLowerCase()}@e2e.test`;
  const password = overrides?.password ?? 'TestPass123';

  const res = await request.post('/auth/signup', { data: { name, email, password } });
  if (!res.ok()) throw new Error(`Signup failed: ${res.status()}`);
  // Specs here test the app behind the tour; auth.spec walks into the tour.
  await markOnboarded(email);
  return { name, email, password };
}
