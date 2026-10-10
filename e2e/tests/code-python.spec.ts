import { test, expect } from '../fixtures/test.js';

test('run Python print("hello") → output "hello"', async ({ authedPage: page }) => {
  await page.goto('/#/lesson/python/print');

  const editor = page.locator('.cm-content').last();
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('print("hello")');

  await page.getByRole('button', { name: '▶ Run' }).last().click();

  await expect(page.getByTestId('code-output').last()).toContainText('hello', { timeout: 30_000 });
});

test('Run Tests opens the verdict in the lesson panel, beside the editor', async ({
  authedPage: page,
}) => {
  await page.goto('/#/lesson/python/print');

  const editor = page.locator('[data-tour="editor"] .cm-content');
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('print("hello")');
  await page.getByRole('button', { name: 'Run Tests' }).click();

  const result = page.locator('[data-tour="result"]');
  await expect(result).toContainText('Wrong answer', { timeout: 60_000 });
  await expect(result).toContainText('Stopped at test 1');
  await expect(result).toContainText('0 / 1');
  await expect(result).toContainText('Expected output');
  await expect(result).toContainText('hello');
  // The editor's own output area stays free for runs.
  await expect(page.getByTestId('code-output').last()).toBeVisible();

  await page.getByRole('tab', { name: 'Lesson', exact: true }).click();
  await expect(page.locator('[data-tour="lesson"] h1')).toBeVisible();
  await expect(result).toHaveCount(0);
  await page.getByRole('tab', { name: 'Result' }).click();
  await expect(result).toContainText('Wrong answer');
});

test('a passed course lesson lists its tests and shows no runtime', async ({
  authedPage: page,
}) => {
  await page.goto('/#/lesson/python/print');

  const editor = page.locator('[data-tour="editor"] .cm-content');
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(
    'print("= CYBERSTARS MISSION CONTROL =\\nStation: Orion\\nStatus: ONLINE\\nWelcome aboard, cadet!")',
  );
  await page.getByRole('button', { name: 'Run Tests' }).click();

  const result = page.locator('[data-tour="result"]');
  await expect(result).toContainText('Accepted', { timeout: 60_000 });
  await expect(result).not.toContainText('Runtime');

  await result.getByRole('button', { name: 'Passed tests (1)' }).click();
  await result.getByRole('button', { name: 'Test 1' }).click();
  await expect(result).toContainText('Expected output');
  await expect(result).toContainText('Welcome aboard, cadet!');
});

test('a passed algorithm shows its load-test runtime next to our solution', async ({
  authedPage: page,
}) => {
  await page.goto('/#/lesson/algo-python/palindrome');

  const editor = page.locator('[data-tour="editor"] .cm-content');
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(
    's = input(); print(all(s[i] == s[-1 - i] for i in range(len(s) // 2)))',
  );
  await page.getByRole('button', { name: 'Run Tests' }).click();

  const result = page.locator('[data-tour="result"]');
  await expect(result).toContainText('Accepted', { timeout: 60_000 });
  await expect(result).toContainText('Runtime');
  await expect(result).toContainText('Our solution (not necessarily the fastest)');
  await result.getByRole('button', { name: /^Passed tests \(\d+\)$/ }).click();
  await expect(result.getByRole('button', { name: /\(load test\)$/ })).toBeVisible();
});

test('an algorithm without a load test shows no runtime', async ({ authedPage: page }) => {
  await page.goto('/#/lesson/algo-python/even-or-odd');

  const editor = page.locator('[data-tour="editor"] .cm-content');
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('print("Odd" if int(input()) % 2 else "Even")');
  await page.getByRole('button', { name: 'Run Tests' }).click();

  const result = page.locator('[data-tour="result"]');
  await expect(result).toContainText('Accepted', { timeout: 60_000 });
  await expect(result).not.toContainText('Runtime');
});
