import { describe, it, expect, vi, beforeAll } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { LessonTour } from './LessonTour';
import { CELL_RUN_EVENT } from '../../constants/tour';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn();
});

function Lesson() {
  return (
    <>
      <div data-tour="lesson">
        <div className="lesson-body">
          <div data-code-cell data-testid="cell-1" />
          <div data-code-cell data-testid="cell-2" />
          <h2>Mission</h2>
          <p>Print the banner</p>
        </div>
      </div>
      <div data-tour="workspace">
        <div data-tour="editor" />
      </div>
    </>
  );
}

const base = {
  userName: 'Ada',
  editorRuns: 0,
  isRunning: false,
  testStatus: null as 'passed' | 'failed' | null,
  completed: false,
};

function setup() {
  const onPanel = vi.fn();
  const onFinish = vi.fn();
  const view = (props: Partial<typeof base> = {}) => (
    <>
      <Lesson />
      <LessonTour {...base} {...props} onPanel={onPanel} onFinish={onFinish} />
    </>
  );
  const utils = render(view());
  return {
    ...utils,
    onPanel,
    onFinish,
    update: (p: Partial<typeof base>) => utils.rerender(view(p)),
  };
}

const next = () => screen.getByText('Next').closest('button')!;
const ranCell = (id: string) =>
  act(() => {
    screen.getByTestId(id).dispatchEvent(new Event(CELL_RUN_EVENT, { bubbles: true }));
  });

describe('LessonTour', () => {
  it('walks a new account from the first cell to passing tests', () => {
    const { onPanel, onFinish, update } = setup();

    expect(screen.getByText('Welcome aboard, Ada')).toBeInTheDocument();
    fireEvent.click(screen.getByText("Let's go"));

    expect(screen.getByText('The lesson')).toBeInTheDocument();
    expect(screen.getByText('1 of 7')).toBeInTheDocument();
    expect(onPanel).toHaveBeenLastCalledWith('lesson');
    fireEvent.click(next());

    // Each cell holds the tour until that very cell has been run.
    expect(screen.getByText('Your first code cell')).toBeInTheDocument();
    expect(next()).toBeDisabled();
    expect(screen.getByText('Run the cell to go on')).toBeInTheDocument();
    ranCell('cell-2');
    expect(next()).toBeDisabled();
    ranCell('cell-1');
    expect(next()).toBeEnabled();
    fireEvent.click(next());

    expect(screen.getByText('A mistake on purpose')).toBeInTheDocument();
    ranCell('cell-2');
    fireEvent.click(next());

    expect(screen.getByText('Your mission')).toBeInTheDocument();
    fireEvent.click(next());

    expect(screen.getByText('Your editor')).toBeInTheDocument();
    expect(onPanel).toHaveBeenLastCalledWith('workspace');
    fireEvent.click(next());

    // Running the editor's code is what opens the next step, once it ends.
    expect(screen.getByText('Run it')).toBeInTheDocument();
    expect(next()).toBeDisabled();
    update({ editorRuns: 1, isRunning: true });
    expect(next()).toBeDisabled();
    update({ editorRuns: 1, isRunning: false });
    fireEvent.click(next());

    expect(screen.getByText('Check it with the tests')).toBeInTheDocument();
    expect(screen.queryByText('Next')).toBeNull();
    update({ editorRuns: 1, testStatus: 'failed' });
    expect(screen.getByText(/^Not yet/)).toBeInTheDocument();

    update({ editorRuns: 1, testStatus: 'passed', completed: true });
    expect(screen.getByText('Lesson complete')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Start exploring'));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('ends early when the tests pass before the last step', () => {
    const { update } = setup();
    fireEvent.click(screen.getByText("Let's go"));
    update({ testStatus: 'passed', completed: true });
    expect(screen.getByText('Lesson complete')).toBeInTheDocument();
  });
});
