import { test, expect } from '@playwright/test';
import { resetDB } from '../helpers/db.js';

test.beforeEach(async () => {
  await resetDB();
});

test('a new account gets a welcome, then the tour lesson to itself until its tests pass', async ({
  page,
}) => {
  await page.goto('/getstarted');
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await page.getByPlaceholder('Choose a username').fill('Cadet');
  await page.getByPlaceholder('you@example.com').fill('tour-e2e@test.com');
  await page.getByPlaceholder('Min. 6 characters').fill('SecurePass123');
  await page.locator('form').getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/lesson\/python\/print$/, { timeout: 10_000 });

  const card = page.getByRole('dialog');
  await card.getByRole('button', { name: 'English' }).click();
  await expect(card).toContainText('Be curious, learn, try and, most importantly, have fun.');
  await card.getByRole('button', { name: "Let's go" }).click();
  await expect(card).toHaveCount(0);

  // The lesson is the student's to explore, with nothing that leads off it:
  // no sidebar, no topbar, and the next lesson refused with a notice.
  await expect(page.getByRole('complementary', { name: 'Main navigation' })).toBeHidden();
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Actions', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page.getByRole('alert')).toContainText('Finish this lesson first');

  await page.locator('[data-tour="editor"] .cm-content').click();
  await page.keyboard.type('print("Hello, Stars!")');
  await page.getByRole('button', { name: 'Run Tests' }).click();
  await expect(card).toContainText('Lesson complete', { timeout: 60_000 });
  await expect(page.locator('[data-tour="result"]')).toContainText('Accepted');
  await card.getByRole('button', { name: 'Start exploring' }).click();
  await expect(card).toHaveCount(0);

  // Then, once, the tutor asks what the student wants to learn.
  await expect(page).toHaveURL(/\/interests$/, { timeout: 10_000 });
  await page.goto('/courses');
  await expect(page).toHaveURL(/\/interests$/);
  const proceed = page.getByRole('button', { name: 'Continue' });
  await expect(proceed).toBeDisabled();
  await page.getByRole('button', { name: /^Linux/ }).click();
  await proceed.click();
  await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });

  await page.goto('/courses');
  await expect(page).toHaveURL(/\/courses$/);
});
