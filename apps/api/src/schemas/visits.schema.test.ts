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

  it('refuses an empty report and one with more than 30 steps', () => {
    expect(stepsReportSchema.safeParse({ steps: [] }).success).toBe(false);
    const many = Array.from({ length: 31 }, () => click('run'));
    expect(stepsReportSchema.safeParse({ steps: many }).success).toBe(false);
  });
});
