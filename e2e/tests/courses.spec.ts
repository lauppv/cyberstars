import { test, expect } from '../fixtures/test.js';

test('courses page shows available courses', async ({ authedPage: page }) => {
  await page.goto('/#/courses');

  await expect(page.getByText('Python')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Java')).toBeVisible();
});
