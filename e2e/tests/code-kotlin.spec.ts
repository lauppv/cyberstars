import { test, expect } from '../fixtures/test.js';

// Single-line body so each typed `}` lands next to CodeMirror's auto-paired `}`
// (which lets it skip instead of inserting a duplicate).
const KOTLIN_CODE = `fun main() { println("hello") }`;

test('run Kotlin println("hello") → output "hello"', async ({ authedPage: page }) => {
  await page.goto('/#/lesson/kotlin/hello-world');

  const editor = page.locator('.cm-content').last();
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(KOTLIN_CODE);

  await page.getByRole('button', { name: '▶ Run' }).last().click();

  await expect(page.getByTestId('code-output').last()).toContainText('hello', { timeout: 45_000 });
});
