import { test, expect } from '../fixtures/test.js';

const JAVA_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("hello");
    }
}`;

test('run Java System.out.println("hello") → output "hello"', async ({ authedPage: page }) => {
  await page.goto('/#/lesson/java/print');

  const editor = page.locator('.cm-content').last();
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(JAVA_CODE);

  await page.getByRole('button', { name: '▶ Run' }).click();

  await expect(page.locator('[class*="CodeOutput"], [class*="output"]').first()).toContainText(
    'hello',
    { timeout: 30_000 },
  );
});
