import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CodeEditor } from './CodeEditor';

function renderEditor(language: string, extra = {}) {
  return render(<CodeEditor value="x = 1" language={language} {...extra} />);
}

describe('CodeEditor language extensions', () => {
  // Each case exercises a distinct branch of getExtensions' switch; the editor
  // must mount without throwing for every supported (and unknown) language.
  const langs = [
    'python',
    'py',
    'algo-python',
    'c',
    'cpp',
    'algo-c',
    'java',
    'algo-java',
    'kotlin',
    'algo-kotlin',
    'ScReAmInG', // unknown → default branch, also covers toLowerCase()
  ];

  for (const lang of langs) {
    it(`mounts for language "${lang}"`, () => {
      const { container } = renderEditor(lang);
      expect(container.querySelector('.cm-editor')).not.toBeNull();
    });
  }
});

describe('CodeEditor run keybinding', () => {
  it('mounts without an onRun handler (no Mod-Enter keymap)', () => {
    const { container } = renderEditor('python');
    expect(container.querySelector('.cm-editor')).not.toBeNull();
  });

  it('mounts with a Mod-Enter keymap when onRun is provided', () => {
    const onRun = vi.fn();
    const { container } = renderEditor('python', { onRun });
    expect(container.querySelector('.cm-editor')).not.toBeNull();
  });

  it('renders in read-only mode', () => {
    const { container } = renderEditor('python', { readOnly: true });
    expect(container.querySelector('.cm-editor')).not.toBeNull();
  });
});
