import { test, expect } from '../fixtures/test.js';

// A web lesson's Run Tests (CYB-110): the site graded in a headless browser in
// the web sandbox, the verdict in the lesson's Result tab, with a reason in
// words, and a pass once the page is as the mission asks.

const PAGE = (heading: string) =>
  [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head><meta charset="UTF-8"><title>Station Log</title></head>',
    '<body>' + heading + '<p>Six crew keep the station running.</p></body>',
    '</html>',
  ].join('\n');

async function writeIndex(page: import('@playwright/test').Page, text: string) {
  await page.getByRole('button', { name: 'index.html', exact: true }).click();
  await page.locator('[data-testid="editor"] .cm-content').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('Delete');
  await page.keyboard.insertText(text);
}

test('Run Tests grades the site in a browser and says why it failed', async ({
  authedPage: page,
}) => {
  // The card recommending dev mode lies over the site's top right
  await page.addInitScript(() => sessionStorage.setItem('cyberstars.devModeHint', 'closed'));
  await page.goto('/lesson/web-dev/first-page');
  await page
    .getByRole('group', { name: 'What the left side shows' })
    .getByRole('button', { name: 'Code' })
    .click();

  await writeIndex(page, PAGE('<h2>Welcome aboard</h2>'));
  await page.getByRole('button', { name: 'Run Tests' }).click();
  const result = page.locator('[data-testid="result"]');
  await expect(result).toContainText('Not as asked yet', { timeout: 60_000 });
  await expect(result).toContainText('Test 1: The page has its biggest heading, with words in it');
  await expect(result).toContainText('Expected the biggest heading (<h1>), found none.');
  await expect(result).toContainText('0 / 1');

  await page
    .getByRole('group', { name: 'What the left side shows' })
    .getByRole('button', { name: 'Code' })
    .click();
  await writeIndex(page, PAGE('<h1>Welcome aboard</h1>'));
  await page.getByRole('button', { name: 'Run Tests' }).click();
  await expect(result).toContainText('Accepted', { timeout: 60_000 });
  await expect(result).toContainText('1 / 1');

  // The attempts keep the site, file by file
  await page.getByRole('tab', { name: 'Submissions' }).click();
  await page
    .getByRole('button', { name: /Accepted/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'index.html' })).toBeVisible();
});
