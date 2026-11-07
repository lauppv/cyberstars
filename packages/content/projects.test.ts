import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { PROJECTS, findProject, splitProjectText } from '@cyberstars/shared/projects';
import { PROJECTS_DIR } from './paths.js';

describe('splitProjectText', () => {
  it('splits the intro from each step’s section', () => {
    expect(splitProjectText('Intro\n\nmore\n\n## One\n\nFirst\n\n## Two\nSecond\n')).toEqual({
      intro: 'Intro\n\nmore',
      steps: [
        { title: 'One', body: 'First' },
        { title: 'Two', body: 'Second' },
      ],
    });
  });

  it('keeps a smaller heading inside its step, and a heading with no body', () => {
    expect(splitProjectText('## One\n### Detail\ntext\n## Two')).toEqual({
      intro: '',
      steps: [
        { title: 'One', body: '### Detail\ntext' },
        { title: 'Two', body: '' },
      ],
    });
  });

  it('leaves a `## ` line inside a code block in its step', () => {
    const text = '## One\n```bash\n## a shell comment\nls\n```\n~~~\n## another\n~~~\n## Two\nx';
    expect(splitProjectText(text)).toEqual({
      intro: '',
      steps: [
        { title: 'One', body: '```bash\n## a shell comment\nls\n```\n~~~\n## another\n~~~' },
        { title: 'Two', body: 'x' },
      ],
    });
  });
});

describe('findProject', () => {
  it('finds a project by its language and slug only', () => {
    expect(findProject('python', 'library-desk')?.title).toBe('Library Desk');
    expect(findProject('java', 'library-desk')).toBeUndefined();
  });
});

// The catalog and the texts are written apart, so a step without its section,
// or a section in the wrong place, would show the wrong text by a box
describe.each(PROJECTS.map((p) => [`${p.language}/${p.slug}`, p] as const))('%s', (_, project) => {
  const file = path.join(PROJECTS_DIR, project.language, `${project.slug}.md`);

  it('has its text, with an intro and a section per step, in order', () => {
    const { intro, steps } = splitProjectText(fs.readFileSync(file, 'utf8'));
    expect(intro).not.toBe('');
    expect(steps.map((s) => s.title)).toEqual(project.steps.map((s) => s.title));
    for (const step of steps) expect(step.body, step.title).not.toBe('');
  });

  it('names each step once, in a form the database keeps', () => {
    const ids = project.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]{1,50}$/);
    expect(project.slug).toMatch(/^[a-z0-9-]{1,100}$/);
  });
});

it('gives each project its own slug in its language', () => {
  const keys = PROJECTS.map((p) => `${p.language}/${p.slug}`);
  expect(new Set(keys).size).toBe(keys.length);
});
