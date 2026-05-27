import { test, expect } from '../fixtures/test.js';

test('run Python print("hello") → output "hello"', async ({ authedPage: page }) => {
  await page.goto('/#/lesson/python/print');

  const editor = page.locator('.cm-content').last();
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('print("hello")');

  await page.getByRole('button', { name: '▶ Run' }).click();

  await expect(page.locator('[class*="CodeOutput"], [class*="output"]').first()).toContainText(
    'hello',
    { timeout: 30_000 },
  );
});
