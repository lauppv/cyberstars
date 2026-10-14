import { test, expect } from '../fixtures/test.js';
import { CODE_FONT, firstFontOf } from '../helpers/fonts.js';

test('the Linux terminal shows commands and output in the app code font', async ({
  authedPage: page,
}) => {
  await page.goto('/lesson/linux/pwd');

  const terminalInput = page.locator('form input').last();
  await expect(terminalInput).toBeVisible({ timeout: 30_000 });
  expect(await firstFontOf(terminalInput)).toBe(CODE_FONT);

  await terminalInput.fill('echo hello');
  await terminalInput.press('Enter');
  const output = page.getByText('hello', { exact: true });
  await expect(output).toBeVisible({ timeout: 15_000 });
  expect(await firstFontOf(output)).toBe(CODE_FONT);
});

test('a failed test shows the output in the app code font', async ({ authedPage: page }) => {
  await page.goto('/lesson/python/print');

  const editor = page.locator('[data-tour="editor"] .cm-content');
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('print("hello")');
  await page.getByRole('button', { name: 'Run Tests' }).click();

  const result = page.locator('[data-tour="result"]');
  await expect(result).toContainText('Wrong answer', { timeout: 60_000 });
  const actual = result.getByText('hello', { exact: true }).first();
  expect(await firstFontOf(actual)).toBe(CODE_FONT);
});
