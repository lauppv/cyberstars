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
});
