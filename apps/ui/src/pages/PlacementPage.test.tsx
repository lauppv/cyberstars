import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { pickQuestions } from '../constants/placement';

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

// Picks Python alone and starts the test
function startPython() {
  fireEvent.click(screen.getByRole('button', { name: 'Python' }));
  fireEvent.click(screen.getByRole('button', { name: 'Start the test' }));
}

// Answers every Python question: right where `right(i)` says so, else the option after the right one
function answerAll(right: (i: number) => boolean) {
  const questions = pickQuestions(['python']);
  questions.forEach((q, i) => {
    const pick = right(i) ? q.correct : (q.correct + 1) % 4;
    fireEvent.click(options()[pick]);
    const last = i === questions.length - 1;
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
    startPython();
    expect(screen.getByText('Question 1 of 10')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'What does this print?' })).toBeDefined();
    expect(options()).toHaveLength(4);
  });

  it('asks which courses first and only from those', () => {
    renderPage();
    const start = screen.getByRole('button', { name: 'Start the test' });
    expect(start).toBeDisabled();
    const web = screen.getByRole('button', { name: 'Web Development' });
    fireEvent.click(web);
    expect(web).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Linux' }));
    fireEvent.click(screen.getByRole('button', { name: 'Linux' }));
    expect(screen.getByRole('button', { name: 'Linux' })).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(start);
    expect(screen.getByText('Question 1 of 10')).toBeDefined();
    expect(screen.getByText('Web Development')).toBeDefined();
    expect(
      screen.getByRole('heading', {
        name: 'Which tag makes the most important heading of a page?',
      }),
    ).toBeDefined();
  });

  it('says nothing about right or wrong until Submit, and goes back to an answer', () => {
    renderPage();
    startPython();
    const next = screen.getByRole('button', { name: 'Next' });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '24' }));
    expect(screen.queryByText('Correct answer')).toBeNull();
    fireEvent.click(next);
    expect(screen.getByText('Question 2 of 10')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('button', { name: '24' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows the score and every answer after Submit, and keeps the score for sign-up', () => {
    renderPage();
    startPython();
    answerAll((i) => i < 7);

    expect(screen.getByText('7/10')).toBeDefined();
    expect(localStorage.getItem('cyberstars.placement')).toBe('7');
    const reviewed = screen.getAllByRole('listitem').filter((li) => li.className.includes('panel'));
    expect(reviewed).toHaveLength(10);
    // A right answer is only the correct one; a wrong one names the student's too
    expect(within(reviewed[0]).getAllByText('Your answer')).toHaveLength(1);
    expect(within(reviewed[0]).queryByText('Correct answer')).toBeNull();
    expect(within(reviewed[9]).getByText('Your answer')).toBeDefined();
    expect(within(reviewed[9]).getByText('Correct answer')).toBeDefined();

    fireEvent.click(screen.getAllByRole('button', { name: 'Get started' })[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted', { state: { mode: 'signup' } });
  });

  it('is fine with every answer wrong', () => {
    renderPage();
    startPython();
    answerAll(() => false);
    expect(screen.getByText('0/10')).toBeDefined();
    expect(localStorage.getItem('cyberstars.placement')).toBe('0');
  });
});
