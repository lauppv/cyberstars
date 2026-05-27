import { test, expect } from '../fixtures/test.js';

test('terminal: echo hello → output "hello"', async ({ authedPage: page }) => {
  await page.goto('/#/lesson/linux/pwd');

  await expect(page.locator('form input')).toBeVisible({ timeout: 30_000 });

  const terminalInput = page.locator('form input').last();
  await terminalInput.fill('echo hello');
  await terminalInput.press('Enter');

  await expect(page.locator('text=hello')).toBeVisible({ timeout: 15_000 });
});
