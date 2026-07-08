import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ForumPostContent } from './ForumPostContent';

describe('ForumPostContent', () => {
  it('renders plain text as-is', () => {
    render(<ForumPostContent content="just a normal reply" />);
    expect(screen.getByText('just a normal reply')).toBeInTheDocument();
  });

  it('renders a fenced code block as a read-only editor without the fences', () => {
    const { container } = render(<ForumPostContent content={'```python\nprint(1)\n```'} />);
    expect(container.querySelector('.cm-editor')).not.toBeNull();
    expect(container.textContent).not.toContain('```');
  });

  it('renders text before and after a code block', () => {
    const { container } = render(<ForumPostContent content={'before\n```py\nx = 1\n```\nafter'} />);
    expect(screen.getByText(/before/)).toBeInTheDocument();
    expect(screen.getByText(/after/)).toBeInTheDocument();
    expect(container.querySelector('.cm-editor')).not.toBeNull();
  });
});
