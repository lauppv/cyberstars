import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { WebPreviewCell } from './WebPreviewCell';

const SOURCE = [
  '<style>',
  '  /* show */',
  '  .tip {',
  '    color: red;',
  '  }',
  '  /* /show */',
  '</style>',
  '<p class="tip">Bring water.</p>',
].join('\n');

const editorText = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.cm-line'))
    .map((line) => line.textContent)
    .join('\n');

describe('WebPreviewCell', () => {
  it('shows only the marked part, and the whole page on View', () => {
    const { container } = render(<WebPreviewCell source={SOURCE} language="css" />);
    expect(editorText(container)).toBe('.tip {\n  color: red;\n}');

    fireEvent.click(screen.getByRole('button', { name: 'View all the code' }));
    expect(editorText(container)).toBe(
      '<style>\n  .tip {\n    color: red;\n  }\n</style>\n<p class="tip">Bring water.</p>',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show less' }));
    expect(editorText(container)).toBe('.tip {\n  color: red;\n}');
  });

  it('shows the page it makes in the sandboxed preview frame', () => {
    const { container } = render(<WebPreviewCell source={SOURCE} language="css" />);
    const frame = container.querySelector('iframe')!;
    expect(frame.getAttribute('src')).toBe('/web-preview.html');
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts allow-forms allow-modals');
  });

  it('has no View button when nothing is hidden', () => {
    const { container } = render(<WebPreviewCell source={'<h1>Hi</h1>'} language="html" />);
    expect(editorText(container)).toBe('<h1>Hi</h1>');
    expect(screen.queryByRole('button')).toBeNull();
  });
});
