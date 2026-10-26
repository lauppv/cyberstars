import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import i18next from 'i18next';
import type { MissedQuestion } from '@cyberstars/shared/laniakea';

const getMissedQuestions = vi.fn();
vi.mock('../../services/adminService', () => ({ getMissedQuestions }));
vi.mock('../../context/CurriculumContext', () => ({
  useCurriculum: () => ({
    courses: [
      {
        key: 'python',
        lessons: [
          { slug: 'print', title: 'Print' },
          { slug: 'variables-str', title: 'Variables (Strings)' },
          { slug: 'variables-int', title: 'Variables (Integers)' },
          { slug: 'print-f', title: 'Print F-strings' },
          { slug: 'recap-variables', title: 'Recap: Player Card' },
          { slug: 'comment', title: 'Comments' },
          { slug: 'if-else', title: 'If / Else' },
        ],
      },
    ],
  }),
}));

const { MissedQuestions } = await import('./MissedQuestions');

const question = (over: Partial<MissedQuestion> = {}): MissedQuestion => ({
  slug: 'if-else',
  id: 'ie-q3',
  text: 'What does `x > 3` give?',
  code: null,
  output: null,
  options: ['True', 'False', '3', 'x'],
  answer: 1,
  picks: [15, 4, 1, 0],
  answered: 20,
  wrong: 16,
  ...over,
});

beforeEach(() => getMissedQuestions.mockReset());

describe('MissedQuestions', () => {
  it('shows each question with its planet, how often it was missed and every pick', async () => {
    getMissedQuestions.mockResolvedValue([question()]);
    render(<MissedQuestions className="" reload={0} />);

    const item = (await screen.findByText('If / Else · ie-q3')).closest('li')!;
    expect(within(item).getByText('16 of 20 wrong · 80%')).toBeInTheDocument();
    expect(within(item).getByText('x > 3').tagName).toBe('CODE');
    const options = within(item)
      .getAllByRole('listitem')
      .map((li) => li.textContent);
    expect(options).toEqual(['True15 · 75%', 'False4 · 20%', '31 · 5%', 'x0 · 0%']);
    const right = within(item).getByLabelText('Right answer').closest('li')!;
    expect(right.textContent).toContain('False');
    expect(getMissedQuestions).toHaveBeenCalledWith('en');
  });

  it("names First steps by the game's name and shows a question's code and output", async () => {
    getMissedQuestions.mockResolvedValue([
      question({ slug: 'print', id: 'p-q1', code: 'print(1 + 1)', output: '2' }),
    ]);
    render(<MissedQuestions className="" reload={0} />);

    expect(await screen.findByText('First steps · p-q1')).toBeInTheDocument();
    expect(screen.getByText('print(1 + 1)').tagName).toBe('PRE');
    expect(screen.getByText('2').tagName).toBe('PRE');
    expect(screen.getByText('True').className).toContain('font-mono');
  });

  it('says when no question has been answered 20 times yet', async () => {
    getMissedQuestions.mockResolvedValue([]);
    render(<MissedQuestions className="" reload={0} />);

    expect(
      await screen.findByText('No question has been answered 20 times yet.'),
    ).toBeInTheDocument();
  });

  it('says it failed, then reads the list again on Refresh', async () => {
    getMissedQuestions.mockRejectedValueOnce(new Error('500')).mockResolvedValueOnce([question()]);
    const { rerender } = render(<MissedQuestions className="" reload={0} />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    rerender(<MissedQuestions className="" reload={1} />);

    expect(await screen.findByText('If / Else · ie-q3')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('asks for the questions in Romanian on a Romanian page', async () => {
    getMissedQuestions.mockResolvedValue([]);
    await i18next.changeLanguage('ro');
    try {
      render(<MissedQuestions className="" reload={0} />);
      expect(
        await screen.findByText('Încă nicio întrebare n-a primit 20 de răspunsuri.'),
      ).toBeInTheDocument();
      expect(getMissedQuestions).toHaveBeenCalledWith('ro');
    } finally {
      await i18next.changeLanguage('en');
    }
  });
});
