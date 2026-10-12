import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import i18n from 'i18next';
import { HowItWorks } from './HowItWorks';

afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('HowItWorks', () => {
  it('walks the four steps in order, each beside a picture from the app', () => {
    render(<HowItWorks />);
    const steps = screen.getAllByRole('listitem');
    expect(
      steps.map((s) => within(s).getAllByRole('heading', { level: 3 })[0].textContent),
    ).toEqual(['Read a lesson', 'Write code in your browser', 'Run it against tests', 'Level up']);
    for (const step of steps) expect(within(step).getByRole('img')).toBeDefined();
  });

  it('shows the first lesson, a run, a failed test and a level', () => {
    render(<HowItWorks />);
    expect(screen.getByRole('img', { name: /first Python lesson/ })).toHaveTextContent(
      'hey, I like pizza',
    );
    expect(screen.getByRole('img', { name: /editor/ })).toHaveTextContent('Sirius Vega Rigel');
    const test = screen.getByRole('img', { name: /failed test/ });
    expect(test).toHaveTextContent('Wrong answer');
    expect(test).toHaveTextContent('Expected outputPilot Shadow is flying Orion Fuel: 400 units');
    expect(test).toHaveTextContent('Your outputPilot Shadow is flying Orion Fuel: 400 Speed');
    const level = screen.getByRole('img', { name: /Level 3/ });
    expect(level).toHaveTextContent('Lv 3 · Navigator');
    expect(level).toHaveTextContent('120 / 500 XP');
    expect(level).toHaveTextContent('12 lessons completed / 60');
  });

  it('says plainly that progress needs an account', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/With a free account/)).toBeDefined();
  });

  it("uses the Romanian lessons' own text and output", async () => {
    await i18n.changeLanguage('ro');
    render(<HowItWorks />);
    expect(screen.getByRole('img', { name: /primei lecții/ })).toHaveTextContent(
      'salut, imi place pizza',
    );
    expect(screen.getByRole('img', { name: /test picat/ })).toHaveTextContent(
      'Combustibil: 400 unitati',
    );
    expect(screen.getByRole('img', { name: /Nivelul 3/ })).toHaveTextContent(
      '12 lecții finalizate / 60',
    );
  });
});
