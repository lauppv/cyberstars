import { test, expect } from '../fixtures/test.js';

// Single lines, so the editor's auto-closed braces are typed over (see CLAUDE.md).
const JAVA_SOLUTION =
  'class Node { int value; Node left; Node right; Node(int value) { this.value = value; } } public class Main { public static void main(String[] args) { int a = 8; int b = 3; int c = 10; int d = 1; int e = 6; Node root = new Node(a); root.left = new Node(b); root.right = new Node(c); root.left.left = new Node(d); root.left.right = new Node(e); System.out.println("Root: " + root.value); System.out.println("Children: " + root.left.value + " " + root.right.value); System.out.println("Leaves: " + root.left.left.value + " " + root.left.right.value + " " + root.right.value); } }';

test('a multi-language lesson passed in Java is ticked once, whatever language is on screen', async ({
  authedPage: page,
}) => {
  await page.goto('/lesson/trees-graphs/trees');
  const languages = page.getByRole('group', { name: 'Programming language' });
  const editor = page.locator('[data-tour="editor"] .cm-content');

  // Code typed in one language waits there while another is on screen.
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('a = 8  # my python');
  await languages.getByRole('button', { name: 'Java' }).click();
  await expect(editor).toContainText('public class Main');

  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(JAVA_SOLUTION);
  await page.getByRole('button', { name: 'Run Tests' }).click();
  const result = page.locator('[data-tour="result"]');
  await expect(result).toContainText('Accepted', { timeout: 90_000 });
  await expect(result).toContainText('12 / 12');

  // The switch sits above the lesson text, behind the Result tab now on screen.
  await page.getByRole('tab', { name: 'Lesson', exact: true }).click();
  await languages.getByRole('button', { name: 'Python' }).click();
  await expect(editor).toContainText('# my python');
  await expect(page.locator('[data-tour="lesson"]')).toContainText('Completed');

  // Saved on the account: after a reload the Python code is still there,
  // and the course counts the lesson once.
  await page.reload();
  await expect(editor).toContainText('# my python', { timeout: 10_000 });
  const progress = await page.request.get('/api/progress/trees-graphs');
  expect(progress.ok()).toBe(true);
  expect(await progress.json()).toMatchObject({ completed: 1, earnedXp: 10 });
});
