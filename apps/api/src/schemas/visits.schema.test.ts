import { describe, it, expect } from 'vitest';
import { pageViewSchema, stepsReportSchema } from './visits.schema.js';

const click = (target: string) => ({ kind: 'click', target });

describe('pageViewSchema', () => {
  it('takes a page with the clicks and scrolls that led to it', () => {
    const report = {
      path: '/courses',
      steps: [click('start-learning'), { kind: 'scroll', target: '50' }],
    };
    expect(pageViewSchema.parse(report)).toEqual(report);
  });

  it('takes a page without steps, as before', () => {
    expect(pageViewSchema.parse({ path: '/' })).toEqual({ path: '/' });
  });

  it('takes the word that the guest did something, and only as true', () => {
    expect(pageViewSchema.parse({ path: '/', active: true })).toEqual({ path: '/', active: true });
    expect(pageViewSchema.safeParse({ path: '/', active: false }).success).toBe(false);
    expect(pageViewSchema.safeParse({ path: '/', active: 'yes' }).success).toBe(false);
  });
});

describe('stepsReportSchema', () => {
  it.each([
    ['text from the page', click('Start learning')],
    ['something typed', click('print("my name is Ana")')],
    ['a name too long', click('a'.repeat(41))],
    ['a depth it does not measure', { kind: 'scroll', target: '60' }],
    ['a page, which only a page view adds', { kind: 'page', target: '/' }],
  ])('refuses %s', (_, step) => {
    expect(stepsReportSchema.safeParse({ steps: [step] }).success).toBe(false);
  });

  it('takes steps, the word that the guest did something, or both', () => {
    expect(stepsReportSchema.parse({ steps: [click('run')] })).toEqual({ steps: [click('run')] });
    expect(stepsReportSchema.parse({ steps: [], active: true })).toEqual({
      steps: [],
      active: true,
    });
    expect(stepsReportSchema.parse({ steps: [click('run')], active: true })).toEqual({
      steps: [click('run')],
      active: true,
    });
  });

  it('refuses an empty report and one with more than 30 steps', () => {
    expect(stepsReportSchema.safeParse({ steps: [] }).success).toBe(false);
    expect(stepsReportSchema.safeParse({ steps: [], active: false }).success).toBe(false);
    expect(stepsReportSchema.safeParse({ active: true }).success).toBe(false);
    const many = Array.from({ length: 31 }, () => click('run'));
    expect(stepsReportSchema.safeParse({ steps: many }).success).toBe(false);
  });
});
