import { describe, it, expect } from 'vitest';
import { inlineVisuals } from './visuals.js';

const files: Record<string, string> = {
  grow: JSON.stringify({
    type: 'tree',
    caption: 'Growing',
    null: { python: 'None', java: 'null', c: 'NULL' },
    steps: [
      {
        add: { 0: 8 },
        code: { python: 'root = Node(8)', java: 'Node root = new Node(8);', c: 'x' },
        caption: 'The root',
      },
    ],
  }),
  broken: '{ not json',
};
const read = (name: string) => files[name] ?? null;

const lesson = (name: string) => `Before\n\n\`\`\`visual\n{"use": "${name}"}\n\`\`\`\n\nAfter\n`;

const filled = (markdown: string) =>
  JSON.parse(markdown.match(/```visual\n([\s\S]*?)\n```/)![1]) as Record<string, unknown>;

describe('inlineVisuals', () => {
  it("puts the named visual in, with the language's values and its name as id", () => {
    const java = inlineVisuals(lesson('grow'), 'java', read);
    expect(java.startsWith('Before\n\n```visual\n{\n  "id": "grow"')).toBe(true);
    expect(java.endsWith('\n```\n\nAfter\n')).toBe(true);
    expect(filled(java)).toEqual({
      id: 'grow',
      type: 'tree',
      caption: 'Growing',
      null: 'null',
      steps: [{ add: { 0: 8 }, code: 'Node root = new Node(8);', caption: 'The root' }],
    });
    expect(filled(inlineVisuals(lesson('grow'), 'python', read))).toMatchObject({
      null: 'None',
      steps: [{ code: 'root = Node(8)' }],
    });
  });

  it('leaves alone a visual written out and an object that names only some languages', () => {
    const written = '```visual\n{"type": "array", "values": [1]}\n```\n';
    expect(inlineVisuals(written, 'c', read)).toBe(written);
    const some: Record<string, string> = {
      ...files,
      some: JSON.stringify({ code: { python: 'a', java: 'b' } }),
    };
    expect(filled(inlineVisuals(lesson('some'), 'c', (n: string) => some[n] ?? null))).toEqual({
      id: 'some',
      code: { python: 'a', java: 'b' },
    });
  });

  it('names the visual that is missing or not JSON', () => {
    expect(() => inlineVisuals(lesson('gone'), 'c', read)).toThrow('no visual named gone');
    expect(() => inlineVisuals(lesson('broken'), 'c', read)).toThrow(
      "the visual broken isn't JSON",
    );
  });
});
