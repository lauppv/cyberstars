import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('styles bold text with the accent colour', () => {
    const { container } = render(<MarkdownRenderer content={'This is **bold** text'} />);
    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong!.textContent).toBe('bold');
    expect(strong!.style.color).toBe('rgb(90, 160, 224)');
  });

  it('renders a GFM table as a real table element', () => {
    const md = '| A | B |\n| - | - |\n| 1 | 2 |';
    const { container } = render(<MarkdownRenderer content={md} />);
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    expect(container.querySelectorAll('th')).toHaveLength(2);
    expect(container.querySelectorAll('td')).toHaveLength(2);
    expect(table!.textContent).toContain('1');
  });

  it('renders a ```strindex fence as the string-index visual', () => {
    const { container } = render(<MarkdownRenderer content={'```strindex\nhello\n^0,2,4\n```'} />);
    // StringIndexTable renders the characters as its own children.
    expect(container.textContent).toContain('h');
    expect(container.textContent).toContain('l');
  });

  it('renders a ```visual fence as the step-by-step player, loaded on demand', async () => {
    const fence = JSON.stringify({
      type: 'array',
      values: [2, 1],
      caption: 'Start',
      steps: [{ compare: [0, 1], swap: true, caption: 'Swap 2 and 1' }],
    });
    render(<MarkdownRenderer content={'```visual\n' + fence + '\n```'} />);
    expect(await screen.findByRole('group', { name: 'Step by step' })).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('shows a ```visual fence it cannot read as plain text', () => {
    const { container } = render(
      <MarkdownRenderer content={'```visual\n{ "type": "array" }\n```'} />,
    );
    expect(container.querySelector('code')!.textContent).toBe('{ "type": "array" }\n');
    expect(screen.queryByRole('group')).toBeNull();
  });

  describe('strindex highlight', () => {
    // A lit box has the thicker border and its index in the label under it. A green one comes
    // back as "1:green", the way the fence asks for it
    const highlighted = (fence: string) => {
      const { container } = render(
        <MarkdownRenderer content={'```strindex\n' + fence + '\n```'} />,
      );
      return [...container.querySelectorAll<HTMLElement>('div')]
        .filter((box) => box.style.borderWidth === '2px')
        .map((box) => {
          const index = Number(box.nextElementSibling!.textContent);
          return box.style.borderColor === 'rgb(59, 167, 118)' ? `${index}:green` : index;
        });
    };

    it('lights no box without a highlight line', () => {
      expect(highlighted('hello')).toEqual([]);
    });

    it('ignores the space after the caret', () => {
      expect(highlighted('hello\n^ 2 4')).toEqual([2, 4]);
    });

    it('lights a position green when it asks for it', () => {
      expect(highlighted('Tommy Vercetti\n^ 0 1:green')).toEqual([0, '1:green']);
    });

    it('lights nothing for a colour it does not know', () => {
      expect(highlighted('hello\n^1:red')).toEqual([]);
    });

    it('reads positions separated by commas', () => {
      expect(highlighted('hello\n^0,2,4')).toEqual([0, 2, 4]);
    });

    it('lights only the one position asked for', () => {
      expect(highlighted('hello\n^3')).toEqual([3]);
    });
  });

  describe(':green text', () => {
    it('colours the phrase, bold words included', () => {
      const { container } = render(
        <MarkdownRenderer content={'and :green[**name[1]** is the second], and so on'} />,
      );
      const span = container.querySelector('span');
      expect(span!.textContent).toBe('name[1] is the second');
      expect(span!.className).toContain('text-[var(--success)]');
      expect(span!.querySelector('strong')!.textContent).toBe('name[1]');
    });

    it('leaves text that only looks like a directive as it was written', () => {
      const lines = ['print :D', 'it prints "12:04"', '**name[0:5]** and **[start:stop:step]**'];
      for (const line of lines) {
        const { container } = render(<MarkdownRenderer content={line} />);
        expect(container.textContent).toBe(line.replaceAll('**', ''));
      }
    });
  });
});
