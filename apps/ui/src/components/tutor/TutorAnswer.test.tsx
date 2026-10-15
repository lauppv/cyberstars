import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TutorAnswer } from './TutorAnswer';

function renderAnswer(text: string) {
  return render(<TutorAnswer text={text} onInAppLink={null} />);
}

describe('TutorAnswer', () => {
  it("colours a code block in the editor's colours once its parser loads", async () => {
    renderAnswer('Like this:\n\n```python\nfor n in range(3):\n    print("hi")\n```');
    expect(await screen.findByText('for')).toHaveClass('tok-keyword');
    expect(screen.getByText('print')).toHaveClass('tok-function');
    expect(screen.getByText('"hi"')).toHaveClass('tok-string');
  });

  it('keeps a block in a language the editor has no parser for plain', async () => {
    const { container } = renderAnswer('```text\n0 1 2\n```');
    expect(await screen.findByText('0 1 2')).toBeInTheDocument();
    expect(container.querySelector('pre span')).toBeNull();
  });

  it('leaves inline code and a block with no language as they are', () => {
    const { container } = renderAnswer('Use `range`.\n\n```\nplain\n```');
    expect(screen.getByText('range').tagName).toBe('CODE');
    expect(container.querySelector('pre code')).toHaveTextContent('plain');
  });
});
