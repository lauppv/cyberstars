import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import { HeroPreview } from './HeroPreview';

afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('HeroPreview', () => {
  it("pictures the lesson's for loop and what it prints, without a title", () => {
    render(<HeroPreview />);
    const picture = screen.getByRole('img', { name: /for loop over a list of names/ });
    expect(picture).toHaveTextContent('for i in range(0, len(names)):');
    expect(picture).toHaveTextContent('Hero number 1: Tommy Hero number 2: Lance');
    expect(picture).not.toHaveTextContent('Python ·');
  });

  it('colours the code like the editor', () => {
    render(<HeroPreview />);
    expect(screen.getByText('"Tommy"')).toHaveStyle({ color: '#98c379' });
    expect(screen.getByText('0')).toHaveStyle({ color: '#d19a66' });
    expect(screen.getByText('for')).toHaveStyle({ color: '#c678dd' });
    expect(screen.getByText('range')).toHaveStyle({ color: '#61afef' });
  });

  it("shows the Romanian lesson's own example in Romanian", async () => {
    await i18n.changeLanguage('ro');
    render(<HeroPreview />);
    const picture = screen.getByRole('img', { name: /buclă for/ });
    expect(picture).toHaveTextContent('nume = ["Tommy", "Lance", "Cortez"]');
    expect(picture).toHaveTextContent('Erou numarul 3: Cortez');
  });
});
