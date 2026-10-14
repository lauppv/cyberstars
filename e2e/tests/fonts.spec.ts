import { test, expect } from '../fixtures/test.js';
import { CODE_FONT, TEXT_FONT, firstFontOf, fontFaces, recordHosts } from '../helpers/fonts.js';

test('a lesson draws its code and text in the fonts that ship with the app', async ({
  authedPage: page,
}) => {
  const hosts = recordHosts(page);
  await page.goto('/lesson/python/print');

  const editor = page.locator('[data-tour="editor"] .cm-scroller');
  await expect(editor).toBeVisible({ timeout: 10_000 });
  expect(await firstFontOf(editor)).toBe(CODE_FONT);
  const output = page.getByTestId('code-output').last().getByText('Run your code to see');
  expect(await firstFontOf(output)).toBe(CODE_FONT);
  expect(await firstFontOf(page.locator('[data-tour="lesson"] h1'))).toBe(TEXT_FONT);

  const faces = await fontFaces(page);
  for (const family of [TEXT_FONT, CODE_FONT]) {
    const own = faces.filter((f) => f.family === family);
    // One variable face covers every weight, so bold is drawn, not faked.
    expect(own.some((f) => f.status === 'loaded' && f.weight.includes(' '))).toBe(true);
    expect(own.some((f) => f.style === 'italic')).toBe(true);
  }

  expect([...hosts].filter((h) => /fonts\.(googleapis|gstatic)\.com/.test(h))).toEqual([]);
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
