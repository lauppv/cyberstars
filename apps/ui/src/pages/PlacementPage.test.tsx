import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { PLACEMENT_QUESTIONS } from '../constants/placement';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import { PlacementPage } from './PlacementPage';

function renderPage() {
  render(
    <MemoryRouter>
      <PlacementPage />
    </MemoryRouter>,
  );
}

// The option buttons of the question on screen, in order
function options() {
  return within(screen.getByRole('main'))
    .getAllByRole('button')
    .filter((b) => b.hasAttribute('aria-pressed'));
}

// Answers every question: right where `right(i)` says so, else the option after the right one
function answerAll(right: (i: number) => boolean) {
  PLACEMENT_QUESTIONS.forEach((q, i) => {
    const pick = right(i) ? q.correct : (q.correct + 1) % 4;
    fireEvent.click(options()[pick]);
    const last = i === PLACEMENT_QUESTIONS.length - 1;
    fireEvent.click(screen.getByRole('button', { name: last ? 'Submit' : 'Next' }));
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('PlacementPage', () => {
  it('opens on a friendly word before the first question', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'A short test before we start' })).toBeDefined();
    expect(screen.getByText(/Don't worry and don't stress/)).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Start the test' }));
    expect(screen.getByText('Question 1 of 12')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'What does this print?' })).toBeDefined();
    expect(options()).toHaveLength(4);
  });

  it('says nothing about right or wrong until Submit, and goes back to an answer', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Start the test' }));
    const next = screen.getByRole('button', { name: 'Next' });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '24' }));
    expect(screen.queryByText('Correct answer')).toBeNull();
    fireEvent.click(next);
    expect(screen.getByText('Question 2 of 12')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('button', { name: '24' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows the score and every answer after Submit, and keeps the score for sign-up', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Start the test' }));
    answerAll((i) => i < 7);

    expect(screen.getByText('7/12')).toBeDefined();
    expect(localStorage.getItem('cyberstars.placement')).toBe('7');
    const reviewed = screen.getAllByRole('listitem').filter((li) => li.className.includes('panel'));
    expect(reviewed).toHaveLength(12);
    // A right answer is only the correct one; a wrong one names the student's too
    expect(within(reviewed[0]).getAllByText('Your answer')).toHaveLength(1);
    expect(within(reviewed[0]).queryByText('Correct answer')).toBeNull();
    expect(within(reviewed[11]).getByText('Your answer')).toBeDefined();
    expect(within(reviewed[11]).getByText('Correct answer')).toBeDefined();

    fireEvent.click(screen.getAllByRole('button', { name: 'Get started' })[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted', { state: { mode: 'signup' } });
  });

  it('is fine with every answer wrong', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Start the test' }));
    answerAll(() => false);
    expect(screen.getByText('0/12')).toBeDefined();
    expect(localStorage.getItem('cyberstars.placement')).toBe('0');
  });
});
