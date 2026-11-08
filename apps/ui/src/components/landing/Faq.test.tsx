import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Faq } from './Faq';

const question = (name: RegExp) => screen.getByRole('button', { name });

describe('Faq', () => {
  it('starts with every answer closed', () => {
    render(<Faq />);
    for (const b of screen.getAllByRole('button')) {
      expect(b).toHaveAttribute('aria-expanded', 'false');
    }
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('opens one answer at a time, and closes it on a second click', () => {
    render(<Faq />);
    fireEvent.click(question(/need an account/));
    expect(question(/need an account/)).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Do I need an account?' })).toHaveTextContent(
      'ten-run limit',
    );

    fireEvent.click(question(/Romanian/));
    expect(question(/need an account/)).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('region')).toHaveLength(1);
    expect(screen.getByRole('region', { name: 'Is it in Romanian?' })).toBeDefined();

    fireEvent.click(question(/Romanian/));
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('asks nine questions, free and nothing to install first, none about the forum', () => {
    render(<Faq />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Is it free?',
      'Do I need to install anything?',
      'Do I need an account?',
      "I've never programmed. Is it for me?",
      'Which language should I start with?',
      'How do I know my code works?',
      "Can I see the solution if I'm stuck?",
      'Does it work on a phone?',
      'Is it in Romanian?',
    ]);
    fireEvent.click(question(/need an account/));
    expect(screen.getByRole('region')).toHaveTextContent(
      'An account lifts the ten-run limit, saves your progress and opens the AI tutor.',
    );
    expect(document.body.textContent).not.toMatch(/forum/i);
  });

  it('ties each answer to its question for screen readers', () => {
    render(<Faq />);
    const button = question(/on a phone/);
    fireEvent.click(button);
    const answer = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(answer).toHaveAttribute('aria-labelledby', button.id);
    expect(answer).not.toHaveAttribute('hidden');
  });
});
