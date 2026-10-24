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
    const items = Array.from(document.querySelector('ol')!.children) as HTMLElement[];
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

  it('shows the first lesson, a run, every test passing and a streak', () => {
    render(<HowItWorks />);
    expect(steps().getByRole('img', { name: /first Python lesson/ })).toHaveTextContent(
      'hey, I like pizza',
    );
    expect(steps().getByRole('img', { name: /editor/ })).toHaveTextContent('Sirius Vega Rigel');
    const test = steps().getByRole('img', { name: /Every test passing/ });
    expect(test).toHaveTextContent('Accepted35 / 35');
    expect(test).toHaveTextContent('Test 1Test 2Test 3 (hidden)');
    expect(test).toHaveTextContent('and 29 more');
    const level = steps().getByRole('img', { name: /12-day streak/ });
    expect(level).toHaveTextContent('12-day streak');
    expect(level).toHaveTextContent('Activity');
  });

  it('shows no step numbers', () => {
    render(<HowItWorks />);
    expect(document.body).not.toHaveTextContent(/Step \d/);
  });

  it('says plainly that progress needs an account', () => {
    render(<HowItWorks />);
    expect(steps().getByText(/once you have an account/)).toBeDefined();
  });

  it("uses the Romanian lessons' own text and output", async () => {
    await i18n.changeLanguage('ro');
    render(<HowItWorks />);
    expect(steps().getByRole('img', { name: /primei lecții/ })).toHaveTextContent(
      'salut, imi place pizza',
    );
    expect(steps().getByRole('img', { name: /Toate testele trec/ })).toHaveTextContent(
      'Acceptat35 / 35',
    );
    expect(steps().getByRole('img', { name: /serie de 12 zile/ })).toHaveTextContent(
      '12 zile la rând',
    );
  });
});
