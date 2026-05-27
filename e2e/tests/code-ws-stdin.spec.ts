import { test, expect } from '../fixtures/test.js';

const PYTHON_INPUT_CODE = `name = input("Name? ")
print(f"Hi {name}")`;

test('WebSocket stdin: Python input() receives user input', async ({ authedPage: page }) => {
  await page.goto('/#/lesson/python/print');

  const editor = page.locator('.cm-content').last();
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(PYTHON_INPUT_CODE);

  await page.getByRole('button', { name: '▶ Run' }).click();

  const outputArea = page.locator('[class*="CodeOutput"], [class*="output"]').first();
  await expect(outputArea).toContainText('Name?', { timeout: 30_000 });

  const stdinInput = outputArea.locator('input[type="text"]');
  await stdinInput.fill('World');
  await stdinInput.press('Enter');

  await expect(outputArea).toContainText('Hi World', { timeout: 15_000 });
});
