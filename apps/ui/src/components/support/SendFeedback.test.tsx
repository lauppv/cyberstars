import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const service = vi.hoisted(() => ({ createTicket: vi.fn() }));
vi.mock('../../services/supportService', () => service);

import { SendFeedback } from './SendFeedback';

function open(context?: string) {
  render(<SendFeedback prompt="Change something?" subject="Lesson: Print" context={context} />);
  fireEvent.click(screen.getByRole('button', { name: /Change something\?/ }));
  return screen.getByRole('textbox', { name: /Change something\?/ });
}

beforeEach(() => vi.clearAllMocks());

describe('SendFeedback', () => {
  it('stays a single line until opened', () => {
    render(<SendFeedback prompt="Change something?" subject="Lesson: Print" />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('sends a feedback ticket with what it is about, then thanks', async () => {
    service.createTicket.mockResolvedValue({ ticketId: 3 });
    const field = open('Question: what prints?');
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    fireEvent.change(field, { target: { value: '  The example is unclear  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Thanks!');
    expect(service.createTicket).toHaveBeenCalledWith({
      type: 'FEEDBACK',
      subject: 'Lesson: Print',
      message: 'The example is unclear\n\nQuestion: what prints?',
    });
  });

  it('keeps a long subject within the ticket limit', async () => {
    service.createTicket.mockResolvedValue({ ticketId: 3 });
    render(<SendFeedback prompt="Tell us" subject={'x'.repeat(250)} />);
    fireEvent.click(screen.getByRole('button', { name: /Tell us/ }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Typo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await screen.findByRole('status');
    expect(service.createTicket).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'x'.repeat(200), message: 'Typo' }),
    );
  });

  it('says why it failed and keeps the text', async () => {
    service.createTicket.mockRejectedValue(new Error('Too many requests'));
    const field = open();
    fireEvent.change(field, { target: { value: 'Typo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Too many requests');
    expect(field).toHaveValue('Typo');
  });

  it('closes on cancel', () => {
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
