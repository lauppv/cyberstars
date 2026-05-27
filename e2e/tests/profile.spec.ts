import { test, expect } from '../fixtures/test.js';

test('update bio on profile page', async ({ authedPage: page }) => {
  await page.goto('/#/profile');

  const bioInput = page.getByPlaceholder('Tell others about yourself...');
  await bioInput.fill('E2E test bio');
  await bioInput.blur();

  await page.waitForTimeout(500);
  await page.reload();

  await expect(page.getByPlaceholder('Tell others about yourself...')).toHaveValue('E2E test bio');
});
