import { describe, it, expect, afterEach } from 'vitest';
import { render, within } from '@testing-library/react';
import i18n from 'i18next';
import { HowItWorks } from './HowItWorks';

// On a wide screen the pinned layout shows the steps, below 1024px the stacked
// list does; jsdom applies no media query, so both render. Read the list.
const steps = () => within(document.querySelector('ol')!);

afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('HowItWorks', () => {
  it('walks the four steps in order, each beside a picture from the app', () => {
    render(<HowItWorks />);
    const items = steps().getAllByRole('listitem');
    expect(
      items.map((s) => within(s).getAllByRole('heading', { level: 3 })[0].textContent),
    ).toEqual(['Read a lesson', 'Write code in your browser', 'Run it against tests', 'Level up']);
    for (const step of items) expect(within(step).getByRole('img')).toBeDefined();
  });

  it("pins the first step's picture on a wide screen, the others hidden", () => {
    render(<HowItWorks />);
    const pinned = Array.from(document.querySelectorAll('[data-picture]'));
    expect(pinned.map((p) => p.getAttribute('data-picture'))).toEqual([
      'read',
      'write',
      'test',
      'level',
    ]);
    expect(pinned.map((p) => p.getAttribute('aria-hidden'))).toEqual([
      'false',
      'true',
      'true',
      'true',
    ]);
  });

  it('shows the first lesson, a run, a failed test and a level', () => {
    render(<HowItWorks />);
    expect(steps().getByRole('img', { name: /first Python lesson/ })).toHaveTextContent(
      'hey, I like pizza',
    );
    expect(steps().getByRole('img', { name: /editor/ })).toHaveTextContent('Sirius Vega Rigel');
    const test = steps().getByRole('img', { name: /failed test/ });
    expect(test).toHaveTextContent('Wrong answer');
    expect(test).toHaveTextContent('Expected outputPilot Shadow is flying Orion Fuel: 400 units');
    expect(test).toHaveTextContent('Your outputPilot Shadow is flying Orion Fuel: 400 Speed');
    const level = steps().getByRole('img', { name: /Level 3/ });
    expect(level).toHaveTextContent('Lv 3 · Navigator');
    expect(level).toHaveTextContent('120 / 500 XP');
    expect(level).toHaveTextContent('12 lessons completed / 60');
  });

  it('says plainly that progress needs an account', () => {
    render(<HowItWorks />);
    expect(steps().getByText(/with a free account/)).toBeDefined();
  });

  it("uses the Romanian lessons' own text and output", async () => {
    await i18n.changeLanguage('ro');
    render(<HowItWorks />);
    expect(steps().getByRole('img', { name: /primei lecții/ })).toHaveTextContent(
      'salut, imi place pizza',
    );
    expect(steps().getByRole('img', { name: /test picat/ })).toHaveTextContent(
      'Combustibil: 400 unitati',
    );
    expect(steps().getByRole('img', { name: /Nivelul 3/ })).toHaveTextContent(
      '12 lecții finalizate / 60',
    );
  });
});
