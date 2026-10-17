import { test, expect } from '../fixtures/test.js';

test('courses page shows available courses', async ({ authedPage: page }) => {
  await page.goto('/courses');

  await expect(page.getByText('Python', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Java', { exact: true }).first()).toBeVisible();
});

test('an old link with a # lands on the same page at its real address', async ({ page }) => {
  await page.goto('/#/courses');

  await expect(page).toHaveURL(/\/courses$/);
  await expect(page.getByText('Python', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
});

test("a course's own address opens its syllabus, with a link to each lesson", async ({ page }) => {
  await page.goto('/courses/python');

  await expect(page.getByText('Chapters')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole('link', { name: /Print/ }).first()).toHaveAttribute(
    'href',
    '/lesson/python/print',
  );
});

test('a multi-language lesson opens in Python, switches language and keeps the pick', async ({
  page,
}) => {
  await page.goto('/lesson/trees-graphs/trees');

  const lesson = page.locator('[data-tour="lesson"]');
  const languages = page.getByRole('group', { name: 'Programming language' });
  await expect(lesson).toContainText('def __init__', { timeout: 10_000 });
  await expect(lesson.getByText('Beta')).toBeVisible();
  await expect(languages.getByRole('button', { name: 'Python' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await languages.getByRole('button', { name: 'Java' }).click();
  await expect(lesson).toContainText('public class Main');
  await expect(lesson).not.toContainText('def __init__');
  await expect(page.locator('[data-tour="editor"] .cm-content')).toContainText('public class Main');

  // The next visit opens the language picked last.
  await page.reload();
  await expect(lesson).toContainText('public class Main', { timeout: 10_000 });
  await expect(languages.getByRole('button', { name: 'Java' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});
