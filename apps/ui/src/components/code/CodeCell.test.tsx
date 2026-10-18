import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const execute = vi.fn();
const sendInput = vi.fn();
let hookState: { output: string; isRunning: boolean };

vi.mock('../../hooks/useCodeExecution', () => ({
  useCodeExecution: () => ({ ...hookState, execute, sendInput }),
}));

import { CodeCell } from './CodeCell';
import { CELL_RUN_EVENT } from '../../constants/tour';
import { RunLessonContext } from './runLesson';

beforeEach(() => {
  vi.clearAllMocks();
  hookState = { output: '', isRunning: false };
});

describe('CodeCell', () => {
  it('hides the output panel when idle with no output', () => {
    const { container } = render(<CodeCell initialCode="print(1)" language="py" />);
    expect(container.querySelector('.cm-editor')).not.toBeNull();
    expect(screen.queryByText('Run your code to see the output...')).toBeNull();
  });

  it('shows the output panel when there is output', () => {
    hookState = { output: 'hello', isRunning: false };
    render(<CodeCell initialCode="print(1)" language="py" />);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('shows the output panel while running even with empty output', () => {
    hookState = { output: '', isRunning: true };
    const { container } = render(<CodeCell initialCode="print(1)" language="py" />);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('maps aliased languages through LANG_MAP when running', () => {
    render(<CodeCell initialCode="print(1)" language="PY" />);
    fireEvent.click(screen.getByRole('button'));
    expect(execute).toHaveBeenCalledWith('print(1)', 'python', undefined);
  });

  it('runs with the lesson it is shown for, so a hidden part can wrap it', () => {
    const lesson = { courseKey: 'algo-trees-graphs', lessonSlug: 'max-depth', lang: 'en' as const };
    render(
      <RunLessonContext.Provider value={lesson}>
        <CodeCell initialCode="def max_depth(root): return 0" language="py" />
      </RunLessonContext.Provider>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(execute).toHaveBeenCalledWith('def max_depth(root): return 0', 'python', lesson);
  });

  it('falls back to the lowercased language when not in LANG_MAP', () => {
    render(<CodeCell initialCode="puts 1" language="Ruby" />);
    fireEvent.click(screen.getByRole('button'));
    expect(execute).toHaveBeenCalledWith('puts 1', 'ruby', undefined);
  });

  it('announces the end of a run, and only the end', () => {
    const onRun = vi.fn();
    document.addEventListener(CELL_RUN_EVENT, onRun);
    const { rerender } = render(<CodeCell initialCode="print(1)" language="py" />);
    hookState = { output: '', isRunning: true };
    rerender(<CodeCell initialCode="print(1)" language="py" />);
    expect(onRun).not.toHaveBeenCalled();
    hookState = { output: '1', isRunning: false };
    rerender(<CodeCell initialCode="print(1)" language="py" />);
    expect(onRun).toHaveBeenCalledTimes(1);
    document.removeEventListener(CELL_RUN_EVENT, onRun);
  });
});
