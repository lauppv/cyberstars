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

    fireEvent.click(question(/install/));
    expect(question(/need an account/)).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('region')).toHaveLength(1);
    expect(screen.getByRole('region', { name: 'Do I need to install anything?' })).toBeDefined();

    fireEvent.click(question(/install/));
    expect(screen.queryByRole('region')).toBeNull();
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
