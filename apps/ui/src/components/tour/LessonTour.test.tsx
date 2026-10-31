import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

const switchLanguage = vi.hoisted(() => vi.fn());
vi.mock('../../i18n', () => ({ switchLanguage }));

import { LessonTour } from './LessonTour';

function setup(completed = false) {
  const onFinish = vi.fn();
  const utils = render(<LessonTour userName="Ada" completed={completed} onFinish={onFinish} />);
  return { ...utils, onFinish };
}

beforeEach(() => {
  sessionStorage.clear();
  switchLanguage.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LessonTour', () => {
  it('opens on a language choice and keeps the pick for the tab', () => {
    setup();
    expect(screen.getByRole('dialog')).toHaveTextContent('Select language · Selectează limba');
    fireEvent.click(screen.getByRole('button', { name: 'Română' }));
    expect(switchLanguage).toHaveBeenCalledWith('ro');
    expect(sessionStorage.getItem('cyberstars.tourLanguage')).toBe('ro');
    expect(screen.getByRole('dialog')).toHaveTextContent('Welcome aboard, Ada');
  });

  it('welcomes the student once, then leaves the lesson to them', () => {
    sessionStorage.setItem('cyberstars.tourLanguage', 'en');
    const { unmount } = setup();
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Be curious, learn, try and, most importantly, have fun.',
    );
    fireEvent.click(screen.getByRole('button', { name: "Let's go" }));
    expect(screen.queryByRole('dialog')).toBeNull();
    // Back on the lesson after a reload or a trip away, it doesn't come up again
    unmount();
    setup();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('lets the student out once the tests pass', () => {
    sessionStorage.setItem('cyberstars.tourLanguage', 'en');
    sessionStorage.setItem('cyberstars.tourWelcome', '1');
    const { onFinish } = setup(true);
    expect(screen.getByRole('dialog')).toHaveTextContent('Lesson complete');
    fireEvent.click(screen.getByRole('button', { name: 'Start exploring' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('goes on in this visit when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(switchLanguage).toHaveBeenCalledWith('en');
    fireEvent.click(screen.getByRole('button', { name: "Let's go" }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
