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
