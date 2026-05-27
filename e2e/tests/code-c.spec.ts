import { test, expect } from '../fixtures/test.js';

// Single-line body so the typed `}` lands next to CodeMirror's auto-paired `}`
// (which lets it skip instead of inserting a duplicate).
const C_CODE = `#include <stdio.h>\nint main(void) { printf("hello"); return 0; }`;

test('run C printf("hello") → output "hello"', async ({ authedPage: page }) => {
  await page.goto('/#/lesson/c/print');

  const editor = page.locator('.cm-content').last();
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(C_CODE);

  await page.getByRole('button', { name: '▶ Run' }).last().click();

  await expect(page.getByTestId('code-output').last()).toContainText('hello', { timeout: 30_000 });
});
