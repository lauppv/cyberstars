import { test, expect } from '../fixtures/test.js';

test('create a forum thread', async ({ authedPage: page }) => {
  await page.goto('/#/forum');

  await page.getByText('help-python').or(page.getByText('Help Python')).first().click();
  await page.waitForLoadState('networkidle');

  await page.getByText('+ New Thread').click();

  await page.getByPlaceholder('Thread title...').fill('E2E Test Thread');
  await page
    .getByPlaceholder('Write your post... Markdown supported.')
    .fill('This is an E2E test post.');

  await page.getByRole('button', { name: 'Create Thread' }).click();

  await expect(page.getByText('E2E Test Thread')).toBeVisible({ timeout: 10_000 });
});
