import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApiClientError } from '../../services/apiClient';
import type { PollDTO } from '@cyberstars/shared/polls';

const getPoll = vi.fn();
const vote = vi.fn();
vi.mock('../../services/pollsService', () => ({ getPoll, vote }));

const { PollModal } = await import('./PollModal');

const poll: PollDTO = {
  id: 3,
  question: 'Which course next?',
  options: [
    { id: 7, text: 'Rust' },
    { id: 8, text: 'Go' },
    { id: 9, text: 'SQL' },
  ],
  voted: false,
};

const onClose = vi.fn();

async function open(p: PollDTO = poll) {
  getPoll.mockResolvedValue(p);
  render(<PollModal pollId={3} onClose={onClose} />);
  await screen.findByText(p.question);
}

const voteButton = () => screen.getByRole('button', { name: 'Vote' });

beforeEach(() => {
  getPoll.mockReset();
  vote.mockReset();
  onClose.mockReset();
});

describe('PollModal', () => {
  it('shows the question and its options, and says the vote is anonymous', async () => {
    await open();
    expect(getPoll).toHaveBeenCalledWith(3);
    expect(screen.getByRole('dialog', { name: 'Poll' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rust' })).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByText('Tick as many as you like. Your vote is anonymous.'),
    ).toBeInTheDocument();
  });

  it('votes only once something is ticked, with every option ticked', async () => {
    vote.mockResolvedValue('');
    await open();
    expect(voteButton()).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Rust' }));
    fireEvent.click(screen.getByRole('button', { name: 'SQL' }));
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByRole('button', { name: 'Rust' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(voteButton());
    expect(await screen.findByRole('status')).toHaveTextContent('Thanks, your vote is in.');
    expect(vote).toHaveBeenCalledWith(3, [7, 9]);
    expect(screen.queryByRole('button', { name: 'Vote' })).toBeNull();
  });

  it('says so when this account already voted', async () => {
    await open({ ...poll, voted: true });
    expect(screen.getByText("You've already voted in this poll.")).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Rust' })).toBeNull();
  });

  it('takes a vote from another tab in the meantime as voted', async () => {
    vote.mockRejectedValue(new ApiClientError(409, 'You already voted in this poll'));
    await open();
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    fireEvent.click(voteButton());
    expect(await screen.findByText("You've already voted in this poll.")).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('says a vote failed and lets it be sent again', async () => {
    vote.mockRejectedValue(new Error('500'));
    await open();
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    fireEvent.click(voteButton());
    expect(await screen.findByRole('alert')).toHaveTextContent("Your vote couldn't be sent.");
    expect(voteButton()).toBeEnabled();
  });

  it("says the poll didn't load", async () => {
    getPoll.mockRejectedValue(new Error('404'));
    render(<PollModal pollId={3} onClose={onClose} />);
    expect(await screen.findByRole('alert')).toHaveTextContent("This poll couldn't be loaded.");
  });

  it('closes on the X, Escape or a click beside it, not on a click inside', async () => {
    await open();
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Close'));
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
