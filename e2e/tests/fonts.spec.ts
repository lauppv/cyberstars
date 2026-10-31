import { test, expect } from '../fixtures/test.js';
import {
  CODE_FONT,
  TEXT_FONT,
  drawsAsTyped,
  firstFontOf,
  fontFaces,
  recordHosts,
} from '../helpers/fonts.js';

test('a lesson draws its code and text in the fonts that ship with the app', async ({
  authedPage: page,
}) => {
  const hosts = recordHosts(page);
  await page.goto('/lesson/python/print');

  const editor = page.locator('[data-testid="editor"] .cm-scroller');
  await expect(editor).toBeVisible({ timeout: 10_000 });
  expect(await firstFontOf(editor)).toBe(CODE_FONT);
  const output = page.getByTestId('code-output').last().getByText('Run your code to see');
  expect(await firstFontOf(output)).toBe(CODE_FONT);
  expect(await firstFontOf(page.locator('[data-testid="lesson"] h1'))).toBe(TEXT_FONT);

  const faces = await fontFaces(page);
  for (const family of [TEXT_FONT, CODE_FONT]) {
    const own = faces.filter((f) => f.family === family);
    // One variable face covers every weight, so bold is drawn, not faked.
    expect(own.some((f) => f.status === 'loaded' && f.weight.includes(' '))).toBe(true);
    expect(own.some((f) => f.style === 'italic')).toBe(true);
  }

  expect([...hosts].filter((h) => /fonts\.(googleapis|gstatic)\.com/.test(h))).toEqual([]);
});

test('code shows != and <= as typed, while text keeps its own arrows', async ({
  authedPage: page,
}) => {
  await page.goto('/lesson/python/break-continue');

  const editor = page.locator('[data-testid="editor"] .cm-content');
  await expect(editor).toBeVisible({ timeout: 10_000 });
  const lesson = page.getByTestId('lesson');
  // The editor (its own theme), inline code (the element) and the output (font-mono).
  expect(await drawsAsTyped(editor)).toBe(true);
  expect(await drawsAsTyped(lesson.locator('p code').first())).toBe(true);
  const output = page.getByTestId('code-output').last().getByText('Run your code to see');
  expect(await drawsAsTyped(output)).toBe(true);
  expect(await drawsAsTyped(lesson.locator('p').first())).toBe(false);
});

test('Romanian letters come from the app font, not a fallback', async ({ authedPage: page }) => {
  await page.goto('/ro/courses');
  await expect(page.getByText('Python', { exact: true }).first()).toBeVisible({ timeout: 10_000 });

  const faces = await fontFaces(page);
  // Latin Extended holds ă, î, ș, ț; the browser loads it only for text that uses them.
  const latinExt = faces.find(
    (f) => f.family === TEXT_FONT && f.style === 'normal' && f.range.includes('U+100-2BA'),
  );
  expect(latinExt?.status).toBe('loaded');
});
