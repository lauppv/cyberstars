import { test, expect } from '@playwright/test';
import { resetDB } from '../helpers/db.js';
import { signupViaAPI, resetCounter } from '../helpers/auth.js';

test.beforeEach(async () => {
  await resetDB();
  resetCounter();
});

test('signup via UI → redirects to welcome page', async ({ page }) => {
  await page.goto('/#/getstarted');

  await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

  await page.getByPlaceholder('Choose a username').fill('TestUser');
  await page.getByPlaceholder('you@example.com').fill('signup-e2e@test.com');
  await page.getByPlaceholder('Min. 8 characters').fill('SecurePass123');

  await page.locator('form').getByRole('button', { name: 'Create Account' }).click();

  await expect(page).toHaveURL(/\/#\/welcome/, { timeout: 10_000 });
});

test('login via UI → redirects to home', async ({ page, context }) => {
  const { email, password } = await signupViaAPI(context.request, {
    email: 'login-e2e@test.com',
    password: 'SecurePass123',
  });

  await page.goto('/#/getstarted');

  await page.getByPlaceholder('you@example.com').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);

  await page.locator('form').getByRole('button', { name: 'Log In' }).click();

  await expect(page).toHaveURL(/\/#\/$/, { timeout: 10_000 });
});
