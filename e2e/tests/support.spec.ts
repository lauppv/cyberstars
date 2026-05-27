import { test, expect } from '../fixtures/test.js';

test('create a support ticket', async ({ authedPage: page }) => {
  await page.goto('/#/support');

  await page.getByPlaceholder('Subject').fill('E2E Test Ticket');
  await page
    .getByPlaceholder('Describe the issue or question in detail...')
    .fill('This is an E2E test.');

  await page.getByRole('button', { name: 'Submit ticket' }).click();

  await expect(page.getByText('E2E Test Ticket')).toBeVisible({ timeout: 10_000 });
});
