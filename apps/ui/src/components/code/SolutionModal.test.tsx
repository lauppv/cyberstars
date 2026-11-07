import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const execute = vi.fn();

vi.mock('../../hooks/useCodeExecution', () => ({
  useCodeExecution: () => ({ output: '', isRunning: false, execute, sendInput: vi.fn() }),
}));

import { SolutionModal } from './SolutionModal';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SolutionModal', () => {
  it("runs the solution with its lesson, so a challenge's hidden part wraps it", () => {
    const lesson = { courseKey: 'algo-trees-graphs', lessonSlug: 'max-depth', lang: 'en' as const };
    render(
      <SolutionModal
        solution={'```py\ndef max_depth(root):\n    return 0\n```\n'}
        language="python"
        runLesson={lesson}
        onClose={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /run/i }));
    expect(execute).toHaveBeenCalledWith('def max_depth(root):\n    return 0', 'python', lesson);
  });

  it("shows a web lesson's files, each under its name, and leaves its images out", () => {
    render(
      <SolutionModal
        solution={
          '```html index.html\n<h1>Hi</h1>\n```\n\n```css css/a.css\nh1 {}\n```\n\n```image img/a.png\n\n```'
        }
        language="web-dev"
        web
        onClose={() => {}}
      />,
    );
    expect(screen.getAllByRole('heading').map((h) => h.textContent)).toEqual([
      'index.html',
      'css/a.css',
    ]);
    expect(document.querySelector('.cm-content')!.textContent).toBe('<h1>Hi</h1>');
    expect(screen.queryByRole('button', { name: /run/i })).toBeNull();
  });
});
