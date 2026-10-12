import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import { HeroPreview } from './HeroPreview';

afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('HeroPreview', () => {
  it('pictures the Flight Report mission, its code and an accepted verdict', () => {
    render(<HeroPreview />);
    const picture = screen.getByRole('img', { name: /Flight Report mission/ });
    expect(picture).toHaveTextContent('Mission: Flight Report');
    expect(picture).toHaveTextContent('print(f"Pilot {pilot} is flying {ship_name}")');
    expect(picture).toHaveTextContent('Accepted');
    expect(picture).toHaveTextContent('32 / 32');
  });

  it('colours the code like the editor', () => {
    render(<HeroPreview />);
    expect(screen.getByText('"Shadow"')).toHaveStyle({ color: '#98c379' });
    expect(screen.getByText('7.5')).toHaveStyle({ color: '#d19a66' });
    expect(screen.getAllByText('print')[0]).toHaveStyle({ color: '#61afef' });
  });

  it("shows the Romanian lesson's own code in Romanian", async () => {
    await i18n.changeLanguage('ro');
    render(<HeroPreview />);
    const picture = screen.getByRole('img', { name: /Raport de Zbor/ });
    expect(picture).toHaveTextContent('nume_nava = "Orion"');
    expect(picture).toHaveTextContent('Acceptat');
  });
});
