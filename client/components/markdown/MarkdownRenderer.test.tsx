import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('renders an untagged multi-line fence as a block, not inline', () => {
    const { container } = render(
      <MarkdownRenderer content={'```\nInput:  hello\nOutput: olleh\n```'} />,
    );
    const code = container.querySelector('code');
    expect(code).not.toBeNull();
    expect(code!.style.display).toBe('block');
    expect(code!.textContent).toBe('Input:  hello\nOutput: olleh\n');
  });

  it('renders a tagged ```text fence as a block', () => {
    const { container } = render(<MarkdownRenderer content={'```text\nline1\nline2\n```'} />);
    const code = container.querySelector('code');
    expect(code).not.toBeNull();
    expect(code!.style.display).toBe('block');
  });

  it('renders true inline code (single backtick) as inline, not block', () => {
    const { container } = render(<MarkdownRenderer content={'this has `x` inline'} />);
    const code = container.querySelector('code');
    expect(code).not.toBeNull();
    expect(code!.style.display).not.toBe('block');
  });

  it('renders an editable-language fence as a runnable CodeCell', () => {
    const { container } = render(<MarkdownRenderer content={'```python\nprint(1)\n```'} />);
    expect(container.querySelector('code')).toBeNull();
  });
});
