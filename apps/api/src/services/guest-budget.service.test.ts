import { describe, it, expect } from 'vitest';
import { GUEST_RUN_BUDGET, guestRunsRemaining, recordGuestRun } from './guest-budget.service.js';

describe('guest-budget', () => {
  it('starts each guest with the full budget', () => {
    expect(guestRunsRemaining('guest:fresh')).toBe(GUEST_RUN_BUDGET);
  });

  it('counts down as runs are recorded and never goes negative', () => {
    const key = 'guest:counter';
    for (let i = 0; i < GUEST_RUN_BUDGET; i++) {
      expect(guestRunsRemaining(key)).toBe(GUEST_RUN_BUDGET - i);
      recordGuestRun(key);
    }
    expect(guestRunsRemaining(key)).toBe(0);
    recordGuestRun(key); // over budget
    expect(guestRunsRemaining(key)).toBe(0);
  });

  it('tracks each guest independently', () => {
    recordGuestRun('guest:a');
    expect(guestRunsRemaining('guest:a')).toBe(GUEST_RUN_BUDGET - 1);
    expect(guestRunsRemaining('guest:b')).toBe(GUEST_RUN_BUDGET);
  });
});
