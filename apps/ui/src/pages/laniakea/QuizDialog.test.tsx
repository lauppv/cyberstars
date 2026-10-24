import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { QuizAnswerResult, QuizView } from '@cyberstars/shared/laniakea';
import { testPlanet } from './testPlanets';

const service = vi.hoisted(() => ({ startQuiz: vi.fn(), answerQuiz: vi.fn() }));
vi.mock('../../services/laniakeaService', () => service);

import { QuizDialog } from './QuizDialog';

const NOW = Date.parse('2026-10-24T12:00:00Z');

// Ten questions; the right option is always the second shown.
function quiz(over: Partial<QuizView> = {}): QuizView {
  return {
    slug: 'print',
    mode: 'conquer',
    questions: Array.from({ length: 10 }, (_, i) => ({
      text: `Question ${i + 1}: what does \`print\` do?`,
      code: i === 0 ? 'print("5")' : null,
      options: ['a', 'b', 'c', 'd'].map((o) => `${o}${i + 1}`),
    })),
    answers: [],
    ...over,
  };
}

function reply(over: Partial<QuizAnswerResult> = {}): QuizAnswerResult {
  return {
    choice: 1,
    correct: true,
    correctChoice: 1,
    status: 'active',
    planet: null,
    leveledUp: false,
    ...over,
  };
}

function open(onClose = vi.fn()) {
  render(<QuizDialog slug="print" title="Print" lang="en" now={NOW} onClose={onClose} />);
  return onClose;
}

beforeEach(() => vi.clearAllMocks());

describe('QuizDialog', () => {
  it('opens the test in the page language and shows the first question', async () => {
    service.startQuiz.mockResolvedValue(quiz());
    open();
    expect(screen.getByText('Opening the test…')).toBeInTheDocument();
    expect(await screen.findByText('Question 1 of 10')).toBeInTheDocument();
    expect(service.startQuiz).toHaveBeenCalledWith('print', 'en');
    expect(screen.getByText('Conquest')).toBeInTheDocument();
    expect(screen.getByText('print("5")')).toBeInTheDocument();
    expect(screen.getAllByText('print')[0].tagName).toBe('CODE');
  });

  it('shows the right answer at once, then moves on', async () => {
    service.startQuiz.mockResolvedValue(quiz());
    service.answerQuiz.mockResolvedValue(reply({ choice: 0, correct: false, correctChoice: 1 }));
    open();
    fireEvent.click(await screen.findByRole('button', { name: /a1/ }));

    expect(await screen.findByText('Wrong')).toBeInTheDocument();
    expect(service.answerQuiz).toHaveBeenCalledWith('print', 0, 0);
    expect(screen.getByRole('button', { name: /a1/ })).toHaveClass('lnk-wrong');
    expect(screen.getByRole('button', { name: /b1/ })).toHaveClass('lnk-right');
    expect(screen.getByRole('button', { name: /c1/ })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Next question' }));
    expect(screen.getByText('Question 2 of 10')).toBeInTheDocument();
  });

  it('answers and moves on from the keyboard', async () => {
    service.startQuiz.mockResolvedValue(quiz());
    service.answerQuiz.mockResolvedValue(reply());
    open();
    const card = (await screen.findByText('Question 1 of 10')).closest('.lnk-quiz-card')!;
    fireEvent.keyDown(card, { key: '2' });
    expect(await screen.findByText('Right')).toBeInTheDocument();
    expect(service.answerQuiz).toHaveBeenCalledWith('print', 0, 1);
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(screen.getByText('Question 2 of 10')).toBeInTheDocument();
    fireEvent.keyDown(card, { key: 'c' });
    await waitFor(() => expect(service.answerQuiz).toHaveBeenLastCalledWith('print', 1, 2));
  });

  it('picks up a test where it was', async () => {
    service.startQuiz.mockResolvedValue(
      quiz({ answers: [{ choice: 1, correct: true, correctChoice: 1 }] }),
    );
    open();
    expect(await screen.findByText('Question 2 of 10')).toBeInTheDocument();
  });

  it('ends at the fifth wrong answer and says when to try again', async () => {
    const wrong = { choice: 0, correct: false, correctChoice: 1 };
    service.startQuiz.mockResolvedValue(quiz({ answers: [wrong, wrong, wrong, wrong] }));
    const planet = testPlanet({ retryAt: new Date(NOW + 300_000).toISOString() });
    service.answerQuiz.mockResolvedValue(reply({ ...wrong, status: 'failed', planet }));
    const onClose = open();
    fireEvent.click(await screen.findByRole('button', { name: /a5/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'See the result' }));

    expect(screen.getByText('Not this time')).toBeInTheDocument();
    expect(screen.getByText('0 right, 5 wrong')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to the ship' }));
    expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ status: 'failed' }));
  });

  it.each([
    [
      'a conquest',
      reply({
        status: 'passed',
        leveledUp: true,
        planet: testPlanet({ level: 1, nextRecapAt: new Date(NOW + 86400_000).toISOString() }),
      }),
      'Planet conquered',
      'Its first recap opens in 1d 0h.',
    ],
    [
      'a recap',
      reply({
        status: 'passed',
        leveledUp: true,
        planet: testPlanet({ level: 3, nextRecapAt: new Date(NOW + 4 * 86400_000).toISOString() }),
      }),
      'Recap passed',
      'The planet climbs to step 3 of 8.',
    ],
    [
      'the last recap',
      reply({ status: 'passed', leveledUp: true, planet: testPlanet({ level: 8 }) }),
      'Yours for good',
      'Achievement unlocked: keeper of Print.',
    ],
    [
      'practice',
      reply({
        status: 'passed',
        planet: testPlanet({ level: 2, nextRecapAt: new Date(NOW + 3600_000).toISOString() }),
      }),
      'Practice done',
      'its next recap opens in 1h 0m.',
    ],
    [
      'practice on a planet kept for good',
      reply({ status: 'passed', planet: testPlanet({ level: 8 }) }),
      'Practice done',
      'This planet is already yours for good.',
    ],
  ])('tells the outcome of %s', async (_, result, heading, words) => {
    const right = { choice: 1, correct: true, correctChoice: 1 };
    service.startQuiz.mockResolvedValue(quiz({ answers: Array(9).fill(right) }));
    service.answerQuiz.mockResolvedValue(result);
    open();
    fireEvent.click(await screen.findByRole('button', { name: /b10/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'See the result' }));
    expect(screen.getByText(heading)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(words.replace(/[.()]/g, '\\$&')))).toBeInTheDocument();
  });

  it('says why the test would not open and tries again', async () => {
    service.startQuiz.mockRejectedValueOnce(new Error('This planet opens for another try soon'));
    service.startQuiz.mockResolvedValueOnce(quiz());
    open();
    expect(await screen.findByRole('alert')).toHaveTextContent('opens for another try soon');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Question 1 of 10')).toBeInTheDocument();
  });

  it('keeps the question when an answer fails to send', async () => {
    service.startQuiz.mockResolvedValue(quiz());
    service.answerQuiz.mockRejectedValue(new Error('Network down'));
    open();
    fireEvent.click(await screen.findByRole('button', { name: /a1/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Network down');
    expect(screen.getByRole('button', { name: /a1/ })).toBeEnabled();
  });

  it('can be left halfway, from its button or with Escape', async () => {
    service.startQuiz.mockResolvedValue(quiz());
    const onClose = open();
    await screen.findByText('Question 1 of 10');
    fireEvent.click(screen.getByRole('button', { name: 'Leave the test' }));
    expect(onClose).toHaveBeenCalledWith(null);
    fireEvent.keyDown(screen.getByRole('dialog').firstChild!, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
