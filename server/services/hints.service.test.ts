import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';

const files = new Map<string, string>();

vi.mock('fs', () => ({
  default: {
    existsSync: (p: string) => files.has(p),
    readFileSync: (p: string) => files.get(p) ?? '',
  },
}));

vi.mock('./paths.js', () => ({
  contentDir: (courseKey: string) => path.join('/lessons', courseKey),
}));

const generateText = vi.fn();
const isGeminiConfigured = vi.fn();
vi.mock('./gemini.service.js', () => ({
  generateText: (opts: unknown) => generateText(opts),
  isGeminiConfigured: () => isGeminiConfigured(),
}));

const { generateHint } = await import('./hints.service.js');

const DIR = path.join('/lessons', 'python');
const STATEMENT = path.join(DIR, 'loops.md');
const SOLUTION = path.join(DIR, 'loops-solution.md');
const RO_STATEMENT = path.join(DIR, 'ro', 'loops.md');
const RO_SOLUTION = path.join(DIR, 'ro', 'loops-solution.md');

beforeEach(() => {
  vi.clearAllMocks();
  files.clear();
  files.set(STATEMENT, 'Print the numbers 1 to 10.');
  isGeminiConfigured.mockReturnValue(true);
  generateText.mockResolvedValue('Think about the range bounds.');
});

describe('generateHint availability', () => {
  it('refuses when Gemini is not configured', async () => {
    isGeminiConfigured.mockReturnValue(false);

    await expect(generateHint('python', 'loops', '', 1, 'en')).rejects.toMatchObject({
      statusCode: 503,
      message: 'AI hints are not available right now',
    });
    expect(generateText).not.toHaveBeenCalled();
  });

  it('404s when the lesson statement is missing', async () => {
    files.clear();

    await expect(generateHint('python', 'loops', '', 1, 'en')).rejects.toMatchObject({
      statusCode: 404,
      message: 'Lesson not found',
    });
  });

  it('returns the hint with the level and the ceiling', async () => {
    await expect(generateHint('python', 'loops', 'print(1)', 2, 'en')).resolves.toEqual({
      hint: 'Think about the range bounds.',
      level: 2,
      maxLevel: 3,
    });
  });

  it('502s when the model call throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    generateText.mockRejectedValue(new Error('network down'));

    await expect(generateHint('python', 'loops', '', 1, 'en')).rejects.toMatchObject({
      statusCode: 502,
    });
  });

  it('502s when the model returns nothing usable', async () => {
    generateText.mockResolvedValue('');

    await expect(generateHint('python', 'loops', '', 1, 'en')).rejects.toMatchObject({
      statusCode: 502,
    });
  });
});

describe('generateHint prompt building', () => {
  const promptOf = () => generateText.mock.calls[0][0] as { system: string; user: string };

  it('escalates the guidance with the hint level', async () => {
    await generateHint('python', 'loops', '', 1, 'en');
    expect(promptOf().system).toContain('Level 1');

    generateText.mockClear();
    await generateHint('python', 'loops', '', 3, 'en');
    expect(promptOf().system).toContain('Level 3');
  });

  it('notes when the person has not written any code yet', async () => {
    await generateHint('python', 'loops', '   ', 1, 'en');

    const { user } = promptOf();
    expect(user).toContain('the student has not written any code yet');
    expect(user).toContain('Print the numbers 1 to 10.');
  });

  it('includes the code and the reference solution when both exist', async () => {
    files.set(SOLUTION, 'for i in range(1, 11): print(i)');

    await generateHint('python', 'loops', 'print(i)', 2, 'en');

    const { user } = promptOf();
    expect(user).toContain('print(i)');
    expect(user).toContain('do not reveal it');
    expect(user).toContain('for i in range(1, 11)');
  });

  it('omits the solution section when the file is blank', async () => {
    files.set(SOLUTION, '   ');

    await generateHint('python', 'loops', 'print(i)', 1, 'en');

    expect(promptOf().user).not.toContain('Reference solution');
  });

  it('builds a Romanian prompt and prefers the Romanian lesson files', async () => {
    files.set(RO_STATEMENT, 'Afiseaza numerele de la 1 la 10.');
    files.set(RO_SOLUTION, 'for i in range(1, 11): print(i)');

    await generateHint('python', 'loops', 'print(i)', 1, 'ro');

    const { system, user } = promptOf();
    expect(system).toContain('tutor prietenos');
    expect(system).toContain('Nivel 1');
    expect(user).toContain('Enunțul lecției:');
    expect(user).toContain('Afiseaza numerele de la 1 la 10.');
    expect(user).toContain('nu o dezvălui');
  });

  it('falls back to the English lesson when no Romanian copy exists', async () => {
    await generateHint('python', 'loops', '', 1, 'ro');

    const { user } = promptOf();
    expect(user).toContain('Print the numbers 1 to 10.');
    expect(user).toContain('Codul curent al persoanei:');
  });
});
