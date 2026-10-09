import { describe, it, expect, vi, beforeAll } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LessonTour } from './LessonTour';
import { CELL_RUN_EVENT } from '../../constants/tour';

beforeAll(() => {
  Element.prototype.scrollBy = vi.fn();
});

function Lesson() {
  return (
    <>
      <div data-tour="lesson">
        <h1>print</h1>
        <div className="lesson-body">
          <div>
            <p>Intro</p>
            <pre>
              <div data-code-cell data-testid="cell-1" />
            </pre>
            <p>Quotes matter</p>
            <hr />
            <p>Look at this</p>
            <pre>
              <div data-code-cell data-testid="cell-2" />
            </pre>
            <h2>Mission</h2>
            <p>Print the banner</p>
          </div>
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
  languagePicked: true,
};

function setup(props: Partial<typeof base> = {}) {
  const handlers = {
    onLanguage: vi.fn(),
    onPanel: vi.fn(),
    onBlocked: vi.fn(),
    onFinish: vi.fn(),
  };
  const view = (p: Partial<typeof base>) => (
    <>
      <Lesson />
      <LessonTour {...base} {...p} {...handlers} />
    </>
  );
  const utils = render(view(props));
  return { ...utils, ...handlers, update: (p: Partial<typeof base>) => utils.rerender(view(p)) };
}

const next = () => screen.getByText('Next').closest('button')!;
const ranCell = (id: string) =>
  act(() => {
    screen.getByTestId(id).dispatchEvent(new Event(CELL_RUN_EVENT, { bubbles: true }));
  });

describe('LessonTour', () => {
  it('opens on a language choice', () => {
    const { onLanguage } = setup({ languagePicked: false });
    expect(screen.getByText('Select language · Selectează limba')).toBeInTheDocument();
    expect(screen.queryByText("Let's go")).toBeNull();
    fireEvent.click(screen.getByText('Română'));
    expect(onLanguage).toHaveBeenCalledWith('ro');
  });

  it('walks the text and every cell, then the code, until the tests pass', () => {
    const { onPanel, onFinish, update } = setup();

    expect(screen.getByText('Welcome aboard, Ada')).toBeInTheDocument();
    fireEvent.click(screen.getByText("Let's go"));

    // Text stretches only ask to be read.
    expect(screen.getByText('The lesson')).toBeInTheDocument();
    expect(screen.getByText('1 of 8')).toBeInTheDocument();
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

    // The two paragraphs around the rule read as one stretch.
    expect(screen.getByText('Read on')).toBeInTheDocument();
    expect(screen.getByText('3 of 8')).toBeInTheDocument();
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

  it('keeps a test run verdict lit in the lesson panel while coding', async () => {
    const { update } = setup();
    fireEvent.click(screen.getByText("Let's go"));
    fireEvent.click(next());
    ranCell('cell-1');
    fireEvent.click(next());
    fireEvent.click(next());
    ranCell('cell-2');
    fireEvent.click(next());
    fireEvent.click(next());
    fireEvent.click(next());
    expect(screen.getByText('Run it')).toBeInTheDocument();
    update({ editorRuns: 1 });
    fireEvent.click(next());
    expect(screen.getByText('Check it with the tests')).toBeInTheDocument();

    const result = document.createElement('div');
    result.dataset.tour = 'result';
    result.getBoundingClientRect = () =>
      ({ left: 10, top: 20, right: 210, bottom: 320, width: 200, height: 300 }) as DOMRect;
    document.body.appendChild(result);
    await waitFor(() => {
      const hole = document.querySelector('svg rect');
      expect(hole).toHaveAttribute('width', String(200 + 12));
    });
    result.remove();
  });

  it('ends early when the tests pass before the last step', () => {
    const { update } = setup();
    fireEvent.click(screen.getByText("Let's go"));
    update({ testStatus: 'passed', completed: true });
    expect(screen.getByText('Lesson complete')).toBeInTheDocument();
  });

  it('reports clicks on the dimmed screen until the tour is done', () => {
    const { onBlocked, update } = setup();
    const dim = () => document.querySelector('svg path')!;
    fireEvent.click(dim());
    expect(onBlocked).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("Let's go"));
    update({ completed: true });
    fireEvent.click(dim());
    expect(onBlocked).toHaveBeenCalledTimes(1);
  });
});
