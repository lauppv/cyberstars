import fs from 'fs';
import path from 'path';
import { test, expect, type Page } from '@playwright/test';
import { completeLessons, resetDB } from '../helpers/db.js';
import { signupViaAPI } from '../helpers/auth.js';

interface Question {
  text: string;
  code: string | null;
  output: string | null;
  options: string[];
}

// The scene draws without a GPU in the browser job, so the ship flies slowly
test.describe.configure({ timeout: 120_000 });

const QUIZ_DIR = path.join(import.meta.dirname, '../../packages/content/lessons/python');

// The right option of every question of a planet, by what the page shows of it,
// from the files the server draws its questions from
function rightOptions(slug: string): Map<string, string> {
  const right = new Map<string, string>();
  for (const file of [`${slug}-quiz.json`, `${slug}-quiz-made.json`]) {
    const full = path.join(QUIZ_DIR, file);
    if (!fs.existsSync(full)) continue;
    const { questions } = JSON.parse(fs.readFileSync(full, 'utf8')) as {
      questions: (Question & { answer: number })[];
    };
    for (const q of questions) right.set(keyOf(q), q.options[q.answer]);
  }
  return right;
}

function keyOf(q: Question): string {
  return JSON.stringify([q.text, q.code ?? null, q.output ?? null, [...q.options].sort()]);
}

// A student with the first `done` Python lessons completed, on the game's page
async function openGame(page: Page, done: number) {
  await resetDB();
  const { email } = await signupViaAPI(page.context().request);
  const slugs = await completeLessons(email, 'python', done);
  await page.goto('/laniakea');
  return slugs;
}

// Through the intro, then First steps from the board, straight ahead of the ship
async function flyToFirstSteps(page: Page) {
  await page.getByRole('button', { name: 'Take the helm' }).click();
  const board = page.getByRole('region', { name: 'Board' });
  await board.getByRole('button', { name: /First steps/ }).click();

  // the aim card shows once the scene runs, and only then do the keys fly
  await expect(page.getByText(/Fly closer to land/)).toBeVisible({ timeout: 30_000 });
  const land = page.getByRole('button', { name: 'Land', exact: true });
  await page.keyboard.down('Shift');
  await page.keyboard.down('w');
  await expect(land).toBeVisible({ timeout: 60_000 });
  await page.keyboard.up('w');
  await page.keyboard.up('Shift');
  return land;
}

// Lands and answers the test's questions, right ones while `right` says so
async function takeTest(page: Page, slug: string, right: (index: number) => boolean) {
  const answers = rightOptions(slug);
  const opened = page.waitForResponse(
    (r) => r.url().endsWith(`/api/laniakea/${slug}/quiz`) && r.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Land', exact: true }).click();
  const { questions } = (await (await opened).json()) as { questions: Question[] };

  const dialog = page.getByRole('dialog');
  for (let i = 0; ; i++) {
    const answer = answers.get(keyOf(questions[i]));
    expect(answer, `question ${i + 1} is in ${slug}'s files`).toBeDefined();
    const at = questions[i].options.indexOf(answer!);
    const choice = right(i) ? at : (at + 1) % questions[i].options.length;
    await dialog.locator('.lnk-option').nth(choice).click();

    const result = dialog.getByRole('button', { name: 'See the result' });
    const next = dialog.getByRole('button', { name: 'Next question' });
    await expect(result.or(next)).toBeVisible();
    if (await result.isVisible()) {
      await result.click();
      return dialog;
    }
    await next.click();
  }
}

test('conquers First steps with every answer right', async ({ page }) => {
  const [slug] = await openGame(page, 6);
  await flyToFirstSteps(page);

  const dialog = await takeTest(page, slug, () => true);
  await expect(dialog.getByRole('heading', { name: 'Planet conquered' })).toBeVisible();
  await expect(dialog.getByText('10 right, 0 wrong')).toBeVisible();
  await dialog.getByRole('button', { name: 'Back to the ship' }).click();

  const board = page.getByRole('region', { name: 'Board' });
  await expect(board.getByRole('button', { name: /First steps.*Next recap in/ })).toBeVisible();
});

test('a test with five wrong answers holds the planet for another try', async ({ page }) => {
  const [slug] = await openGame(page, 6);
  await flyToFirstSteps(page);

  const dialog = await takeTest(page, slug, () => false);
  await expect(dialog.getByRole('heading', { name: 'Not this time' })).toBeVisible();
  await expect(dialog.getByText('0 right, 5 wrong')).toBeVisible();
  await dialog.getByRole('button', { name: 'Back to the ship' }).click();

  const board = page.getByRole('region', { name: 'Board' });
  await expect(board.getByRole('button', { name: /First steps.*Next try in/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Land', exact: true })).toBeHidden();
});

test('the game stays locked with five of the six lessons done', async ({ page }) => {
  await openGame(page, 5);

  await expect(
    page.getByRole('heading', { name: 'Laniakea opens after the first 6 Python lessons' }),
  ).toBeVisible();
  await expect(page.getByText('5 of 6 done')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Take the helm' })).toBeHidden();
});
