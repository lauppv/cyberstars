import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import type { PollResultsDTO } from '@cyberstars/shared/polls';

const sendPoll = vi.fn();
const getPolls = vi.fn();
vi.mock('../../services/adminService', () => ({ sendPoll, getPolls }));

const { PollSection } = await import('./PollSection');

const question = () => screen.getByLabelText('Ask every user something');
const option = (n: number) => screen.getByLabelText(`Option ${n}`);
const send = () => screen.getByRole('button', { name: 'Send' });
const confirm = () => screen.getByRole('dialog', { name: 'Send this poll to all users?' });

function write(q: string, ...options: string[]) {
  render(<PollSection className="" />);
  fireEvent.change(question(), { target: { value: q } });
  options.forEach((text, i) => {
    if (i >= 2) fireEvent.click(screen.getByRole('button', { name: 'Add option' }));
    fireEvent.change(option(i + 1), { target: { value: text } });
  });
}

// Braces, so the hook doesn't hand back the mock, which Vitest would call as a teardown
beforeEach(() => {
  sendPoll.mockReset();
  getPolls.mockReset();
  getPolls.mockResolvedValue([]);
});

const sentBefore: PollResultsDTO[] = [
  {
    id: 2,
    question: 'Which course next?',
    authorName: 'Ada',
    createdAt: '2026-11-03T10:00:00.000Z',
    recipients: 40,
    voters: 4,
    options: [
      { id: 7, text: 'Rust', votes: 3 },
      { id: 8, text: 'Go', votes: 2 },
    ],
  },
  {
    id: 1,
    question: 'Too hard?',
    authorName: null,
    createdAt: '2026-10-20T10:00:00.000Z',
    recipients: 30,
    voters: 0,
    options: [
      { id: 1, text: 'Yes', votes: 0 },
      { id: 2, text: 'No', votes: 0 },
    ],
  },
];

describe('PollSection', () => {
  it('starts with two options and has nothing to send until a question and both are written', () => {
    write('Which course next?', 'Rust');
    expect(screen.queryByLabelText('Option 3')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Remove option 1' })).toBeNull();
    expect(send()).toBeDisabled();
    fireEvent.change(option(2), { target: { value: 'Go' } });
    expect(send()).toBeEnabled();
    fireEvent.change(question(), { target: { value: '   ' } });
    expect(send()).toBeDisabled();
  });

  it('adds options up to ten and removes one while more than two are left', () => {
    render(<PollSection className="" />);
    const add = screen.getByRole('button', { name: 'Add option' });
    for (let i = 0; i < 8; i++) fireEvent.click(add);
    expect(option(10)).toBeInTheDocument();
    expect(add).toBeDisabled();

    fireEvent.change(option(2), { target: { value: 'Go' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove option 1' }));
    expect(option(1)).toHaveValue('Go');
    expect(screen.queryByLabelText('Option 10')).toBeNull();
    expect(add).toBeEnabled();
  });

  it('leaves an empty option out and refuses the same one twice', () => {
    write('Which course next?', 'Rust', ' Rust ', '');
    expect(screen.getByText('Two options say the same thing.')).toBeInTheDocument();
    expect(send()).toBeDisabled();
    fireEvent.change(option(2), { target: { value: '' } });
    fireEvent.change(option(3), { target: { value: 'Go' } });
    expect(screen.queryByText('Two options say the same thing.')).toBeNull();
    fireEvent.click(send());
    const items = within(confirm()).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual(['Rust', 'Go']);
  });

  it('asks first, showing the poll it sends', () => {
    write('  Which course next?  ', 'Rust', 'Go');
    fireEvent.click(send());
    expect(confirm()).toHaveTextContent('Which course next?');
    expect(confirm()).toHaveTextContent('the vote is anonymous');
    expect(sendPoll).not.toHaveBeenCalled();
  });

  it('goes back to writing on Cancel, Escape or a click beside the question', () => {
    write('Which course next?', 'Rust', 'Go');
    fireEvent.click(send());
    fireEvent.click(within(confirm()).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(send());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(send());
    fireEvent.mouseDown(confirm());
    expect(confirm()).toBeInTheDocument();
    fireEvent.mouseDown(confirm().parentElement!);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(question()).toHaveValue('Which course next?');
    expect(sendPoll).not.toHaveBeenCalled();
  });

  it('sends the trimmed poll, says how many got it and starts a new one', async () => {
    sendPoll.mockResolvedValue({ sent: 3 });
    write('  Which course next?  ', ' Rust ', 'Go', '');
    fireEvent.click(send());
    fireEvent.click(within(confirm()).getByRole('button', { name: 'Send' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Sent to 3 users');
    expect(sendPoll).toHaveBeenCalledWith('Which course next?', ['Rust', 'Go']);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(question()).toHaveValue('');
    expect(option(1)).toHaveValue('');
    expect(screen.queryByLabelText('Option 3')).toBeNull();
  });

  it('says so when it fails and keeps what was written', async () => {
    sendPoll.mockRejectedValue(new Error('500'));
    write('Which course next?', 'Rust', 'Go');
    fireEvent.click(send());
    fireEvent.click(within(confirm()).getByRole('button', { name: 'Send' }));
    expect(await within(confirm()).findByRole('alert')).toHaveTextContent(
      "The poll couldn't be sent.",
    );
    expect(within(confirm()).getByRole('button', { name: 'Send' })).toBeEnabled();
    expect(option(2)).toHaveValue('Go');
  });
});

describe('PollSection results', () => {
  it('lists the polls sent before with who voted and each option as a share of the voters', async () => {
    getPolls.mockResolvedValue(sentBefore);
    render(<PollSection className="" />);
    expect(await screen.findByText('Which course next?')).toBeInTheDocument();
    expect(screen.getByText('November 3, 2026 · Ada · 4 of 40 voted')).toBeInTheDocument();
    expect(screen.getByText('3 · 75%')).toBeInTheDocument();
    expect(screen.getByText('2 · 50%')).toBeInTheDocument();
  });

  it('shows 0% before anyone voted, with no one named once the author is gone', async () => {
    getPolls.mockResolvedValue([sentBefore[1]]);
    render(<PollSection className="" />);
    expect(
      await screen.findByText('October 20, 2026 · Someone · 0 of 30 voted'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('0 · 0%')).toHaveLength(2);
  });

  it('says when none was sent yet', async () => {
    render(<PollSection className="" />);
    expect(await screen.findByText('No poll has been sent yet.')).toBeInTheDocument();
  });

  it("says the history didn't load", async () => {
    getPolls.mockRejectedValue(new Error('500'));
    render(<PollSection className="" />);
    expect(
      await screen.findByText("The polls sent before couldn't be loaded."),
    ).toBeInTheDocument();
  });

  it('adds the one just sent', async () => {
    getPolls.mockResolvedValueOnce([]).mockResolvedValueOnce([sentBefore[0]]);
    sendPoll.mockResolvedValue({ sent: 3 });
    write('Which course next?', 'Rust', 'Go');
    fireEvent.click(send());
    fireEvent.click(within(confirm()).getByRole('button', { name: 'Send' }));
    expect(await screen.findByText('November 3, 2026 · Ada · 4 of 40 voted')).toBeInTheDocument();
    expect(getPolls).toHaveBeenCalledTimes(2);
  });
});
