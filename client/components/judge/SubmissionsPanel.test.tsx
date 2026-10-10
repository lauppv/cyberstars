import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubmissionsPanel } from './SubmissionsPanel';
import * as testsService from '../../services/testsService';
import type { SubmissionDetail, SubmissionSummary } from '../../../shared/tests';

vi.mock('../../services/testsService', () => ({
  getSubmission: vi.fn(),
}));

const getSubmission = vi.mocked(testsService.getSubmission);

const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

const list: SubmissionSummary[] = [
  {
    id: 2,
    status: 'passed',
    passedCount: 5,
    total: 5,
    runtimeMs: 42.5,
    referenceMs: 40,
    lang: 'en',
    createdAt: minutesAgo(3),
  },
  {
    id: 1,
    status: 'failed',
    passedCount: 2,
    total: 5,
    runtimeMs: null,
    referenceMs: null,
    lang: 'ro',
    createdAt: minutesAgo(60 * 30),
  },
];

const detail: SubmissionDetail = {
  ...list[1],
  code: 'print("hi")',
  syntaxError: null,
  structureFailures: [],
  failedCase: { index: 2, visible: true, passed: false, expected: 'hello', actual: 'hi' },
};

const handlers = () => ({ onLoad: vi.fn(), onRetry: vi.fn(), onLoadCode: vi.fn() });

beforeEach(() => {
  getSubmission.mockReset();
});

describe('SubmissionsPanel', () => {
  it('asks for the history on first open and waits for it', () => {
    const h = handlers();
    render(
      <SubmissionsPanel language="algo-python" showRuntime list={null} failed={false} {...h} />,
    );
    expect(h.onLoad).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('offers a retry when the history could not be loaded', () => {
    const h = handlers();
    render(<SubmissionsPanel language="algo-python" showRuntime list={null} failed {...h} />);
    expect(h.onLoad).not.toHaveBeenCalled();
    expect(screen.getByText("Couldn't load your submissions.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(h.onRetry).toHaveBeenCalled();
  });

  it('says so when there are no attempts yet', () => {
    render(
      <SubmissionsPanel
        language="algo-python"
        showRuntime
        list={[]}
        failed={false}
        {...handlers()}
      />,
    );
    expect(screen.getByText(/No submissions yet/)).toBeInTheDocument();
  });

  it('lists attempts with status, count, runtime or a dash, and age', () => {
    const h = handlers();
    render(
      <SubmissionsPanel language="algo-python" showRuntime list={list} failed={false} {...h} />,
    );
    expect(h.onLoad).not.toHaveBeenCalled();
    const rows = screen.getAllByRole('button');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Accepted');
    expect(rows[0]).toHaveTextContent('5 / 5');
    expect(rows[0]).toHaveTextContent('42.5 ms');
    expect(rows[0]).toHaveTextContent('3m ago');
    expect(rows[1]).toHaveTextContent('Failed');
    expect(rows[1]).toHaveTextContent('—');
    expect(rows[1]).toHaveTextContent('1d ago');
  });

  it('leaves the runtime out on a course lesson, in the list and in an attempt', async () => {
    getSubmission.mockResolvedValue({ ...detail, runtimeMs: 42.5, referenceMs: 40 });
    render(
      <SubmissionsPanel
        language="python"
        showRuntime={false}
        list={list}
        failed={false}
        {...handlers()}
      />,
    );
    expect(screen.queryByText('Runtime')).not.toBeInTheDocument();
    const rows = screen.getAllByRole('button');
    expect(rows[0]).toHaveTextContent('5 / 5');
    expect(rows[0]).not.toHaveTextContent('ms');
    expect(rows[1]).not.toHaveTextContent('—');

    fireEvent.click(rows[0]);
    expect(await screen.findByText('Submitted code')).toBeInTheDocument();
    expect(screen.queryByText('Runtime')).not.toBeInTheDocument();
  });

  it('opens an attempt with its verdict and code, loads it, and goes back', async () => {
    getSubmission.mockResolvedValue(detail);
    const h = handlers();
    render(
      <SubmissionsPanel language="algo-python" showRuntime list={list} failed={false} {...h} />,
    );
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(getSubmission).toHaveBeenCalledWith(1);

    expect(await screen.findByRole('heading', { name: 'Wrong answer' })).toBeInTheDocument();
    expect(screen.getByText('Stopped at test 3')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('Submitted code')).toBeInTheDocument();
    expect(screen.queryByText('Runtime')).not.toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('.cm-content')).toHaveTextContent('hi'));

    fireEvent.click(screen.getByRole('button', { name: 'Load into editor' }));
    expect(h.onLoadCode).toHaveBeenCalledWith('print("hi")');

    fireEvent.click(screen.getByRole('button', { name: 'All submissions' }));
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('says so when an attempt cannot be opened', async () => {
    getSubmission.mockRejectedValue(new Error('404'));
    render(
      <SubmissionsPanel
        language="algo-python"
        showRuntime
        list={list}
        failed={false}
        {...handlers()}
      />,
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(await screen.findByText("Couldn't load your submissions.")).toBeInTheDocument();
  });
});
