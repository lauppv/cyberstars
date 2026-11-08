import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test.js';

// A web lesson's IDE (CYB-109): files made in the tree, the preview drawing
// them in a frame sealed off from the lesson, its console, links between the
// site's pages, and a loop that never ends stopped without freezing the tab.

async function newFile(page: Page, path: string) {
  await page.getByRole('button', { name: 'New file' }).click();
  const box = page.getByRole('textbox', { name: /Name of the new file/ });
  await box.fill(path);
  await box.press('Enter');
}

// Opens a file from the tree and writes its whole text
async function write(page: Page, name: string, text: string) {
  await page.getByRole('button', { name, exact: true }).click();
  await page.locator('.cm-content').first().click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('Delete');
  await page.keyboard.insertText(text);
}

test('a web lesson previews a site of several files, sealed off from the lesson', async ({
  page,
}) => {
  await page.goto('/lesson/web-dev/first-page');
  // The left side shows the lesson until the student turns to the code
  await expect(page.getByTestId('lesson')).toBeVisible({ timeout: 10_000 });
  await page
    .getByRole('group', { name: 'What the left side shows' })
    .getByRole('button', { name: 'Code' })
    .click();
  await expect(page.getByRole('button', { name: 'index.html', exact: true })).toBeVisible();

  await newFile(page, 'style.css');
  await newFile(page, 'js/app.js');
  await newFile(page, 'crew.html');
  await write(page, 'style.css', 'h1 { color: rgb(255, 0, 0); }');
  await write(
    page,
    'app.js',
    [
      "document.querySelector('h1').textContent = 'Station Log';",
      "try { parent.document.title; console.log('parent open'); } catch { console.log('parent closed'); }",
      "fetch('/api/progress', { credentials: 'include' }).then((r) => console.log('api', r.status));",
    ].join('\n'),
  );
  await write(page, 'crew.html', '<h2 id="crew">Crew</h2><a href="index.html">back</a>');
  await write(
    page,
    'index.html',
    '<!DOCTYPE html><link rel="stylesheet" href="style.css"><h1>x</h1><a id="to-crew" href="crew.html">crew</a><script src="js/app.js"></script>',
  );
  // The site follows the files on its own
  const frame = page.frameLocator('iframe[title^="Preview"]');
  await expect(frame.locator('h1')).toHaveText('Station Log', { timeout: 10_000 });
  await expect(frame.locator('h1')).toHaveCSS('color', 'rgb(255, 0, 0)');
  const log = page.getByRole('log', { name: 'Console' });
  await expect(log).toContainText('parent closed');
  // The site's own address in the page answers from its files, not the API
  await expect(log).toContainText('api 404');

  await frame.locator('#to-crew').click();
  await expect(frame.locator('#crew')).toHaveText('Crew');
  await expect(page.getByTitle('Preview of crew.html')).toBeVisible();

  // Opening a page from the files shows it
  await write(page, 'index.html', '<h1>loop</h1><script>while (true) {}</script>');
  await expect(page.getByTitle('Preview of index.html')).toBeVisible();
  await expect(page.getByText('Paused: a loop ran too long')).toBeVisible({ timeout: 15_000 });
  await expect(log).toContainText('Stopped a loop that ran too long, on line 1 of index.html.');
  // The lesson still answers
  await page.locator('.cm-content').first().click();
  await page.keyboard.insertText('<!-- still here -->');
  await expect(page.locator('.cm-content').first()).toContainText('still here');
});

test('Run says once what it is for, then draws the page again', async ({ page }) => {
  await page.goto('/lesson/web-dev/first-page');
  await expect(page.getByTitle('Preview of index.html')).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: '▶ Run' }).click();
  const card = page.getByRole('dialog', { name: 'Your page updates by itself' });
  await expect(card).toContainText('Press Run only when the page didn');
  await card.getByRole('button', { name: 'Got it' }).click();
  await expect(card).toHaveCount(0);
  // Once is enough on this device
  await page.getByRole('button', { name: '▶ Run' }).click();
  await expect(card).toHaveCount(0);
  await expect(page.getByTitle('Preview of index.html')).toBeVisible();
});

// CYB-119: a web lesson starts from the student's passing site with the
// lesson's new files, and Reset goes back to it or to the course's version.
// The course has one web lesson so far, so the start is answered here.
test("a web lesson starts from the student's site, and Reset offers both versions", async ({
  page,
}) => {
  const site = (h1: string) =>
    `\`\`\`html index.html\n<h1>${h1}</h1>\n\`\`\`\n\n\`\`\`html crew.html\n<h2>Crew</h2>\n\`\`\``;
  await page.route('**/api/lessons/web-dev/first-page/start*', (route) =>
    route.fulfill({ json: { course: site('Course'), passed: site('Mine') } }),
  );
  await page.goto('/lesson/web-dev/first-page');
  const frame = page.frameLocator('iframe[title^="Preview"]');
  await expect(frame.locator('h1')).toHaveText('Mine', { timeout: 10_000 });
  await page
    .getByRole('group', { name: 'What the left side shows' })
    .getByRole('button', { name: 'Code' })
    .click();
  await expect(page.getByRole('button', { name: 'crew.html', exact: true })).toBeVisible();

  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: "Reset to the course's site" }).click();
  await expect(frame.locator('h1')).toHaveText('Course', { timeout: 10_000 });

  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: 'Reset to your site' }).click();
  await expect(frame.locator('h1')).toHaveText('Mine', { timeout: 10_000 });
});

// A start that fails to load says so over the IDE, and Try again brings it in
test("a web lesson says when its start didn't load, and Try again brings it in", async ({
  page,
}) => {
  let fail = true;
  await page.route('**/api/lessons/web-dev/first-page/start*', (route) =>
    fail
      ? route.abort()
      : route.fulfill({
          json: { course: '```html index.html\n<h1>Course</h1>\n```', passed: null },
        }),
  );
  await page.goto('/lesson/web-dev/first-page');
  const alert = page.getByRole('alert').filter({ hasText: "couldn't be loaded" });
  await expect(alert).toBeVisible({ timeout: 10_000 });
  fail = false;
  await alert.getByRole('button', { name: 'Try again' }).click();
  await expect(alert).toHaveCount(0);
  await expect(page.frameLocator('iframe[title^="Preview"]').locator('h1')).toHaveText('Course', {
    timeout: 10_000,
  });
});
