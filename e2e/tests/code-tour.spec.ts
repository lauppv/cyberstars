import { test, expect } from '@playwright/test';
import { resetDB } from '../helpers/db.js';

test.beforeEach(async () => {
  await resetDB();
});

test('a new account walks the tour lesson and is let out once its tests pass', async ({ page }) => {
  await page.goto('/#/getstarted');
  await page.getByRole('button', { name: 'Sign Up', exact: true }).click();
  await page.getByPlaceholder('Choose a username').fill('Cadet');
  await page.getByPlaceholder('you@example.com').fill('tour-e2e@test.com');
  await page.getByPlaceholder('Min. 8 characters').fill('SecurePass123');
  await page.locator('form').getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/#\/lesson\/python\/print$/, { timeout: 10_000 });

  const card = page.getByRole('dialog');
  const next = card.getByRole('button', { name: 'Next' });
  await card.getByRole('button', { name: "Let's go" }).click();
  await expect(card).toContainText('The lesson');
  await next.click();

  // Each of the lesson's cells has to be run before the tour moves on.
  const cells = page.locator('[data-code-cell]');
  const cellCount = await cells.count();
  expect(cellCount).toBeGreaterThan(0);
  for (let i = 0; i < cellCount; i++) {
    await expect(next).toBeDisabled();
    await cells.nth(i).getByRole('button', { name: '▶ Run' }).click();
    await expect(next).toBeEnabled({ timeout: 30_000 });
    await next.click();
  }

  await expect(card).toContainText('Your mission');
  await next.click();
  await expect(card).toContainText('Your editor');

  await page.locator('[data-tour="editor"] .cm-content').click();
  for (const line of [
    '== CYBERSTARS MISSION CONTROL ==',
    'Station: Orion',
    'Status: ONLINE',
    'Welcome aboard, cadet!',
  ]) {
    await page.keyboard.type(`print("${line}")`);
    await page.keyboard.press('Enter');
  }
  await next.click();

  await expect(card).toContainText('Run it');
  await expect(next).toBeDisabled();
  await page.locator('[data-tour="workspace"]').getByRole('button', { name: '▶ Run' }).click();
  await expect(next).toBeEnabled({ timeout: 30_000 });
  await next.click();

  await expect(card).toContainText('Check it with the tests');
  await page.getByRole('button', { name: 'Run Tests' }).click();
  await expect(card).toContainText('Lesson complete', { timeout: 60_000 });
  await card.getByRole('button', { name: 'Start exploring' }).click();
  await expect(card).toHaveCount(0);

  await page.goto('/#/courses');
  await expect(page).toHaveURL(/\/#\/courses$/);
});
