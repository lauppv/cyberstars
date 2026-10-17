import { describe, it, expect } from 'vitest';
import { parseQuestion } from './checks';
import { parseVisual } from './parseVisual';

describe('parseQuestion', () => {
  it('reads two to four choices and the right one by its place', () => {
    expect(parseQuestion({ choices: ['Yes', 'No'], answer: 1 }, 'Swap?')).toEqual({
      choices: ['Yes', 'No'],
      answer: 1,
    });
    expect(parseQuestion({ choices: ['5', '6', '7', '8'], answer: 0 }, 'Mid?')).toEqual({
      choices: ['5', '6', '7', '8'],
      answer: 0,
    });
  });

  it('gives nothing back for a step without choices', () => {
    expect(parseQuestion({}, 'Swap?')).toBeUndefined();
    expect(parseQuestion({}, undefined)).toBeUndefined();
  });

  it.each([
    ['choices without a question', { choices: ['Yes', 'No'], answer: 0 }, undefined],
    ['choices without an answer', { choices: ['Yes', 'No'] }, 'Swap?'],
    ['an answer without choices', { answer: 0 }, 'Swap?'],
    ['one choice', { choices: ['Yes'], answer: 0 }, 'Swap?'],
    ['five choices', { choices: ['1', '2', '3', '4', '5'], answer: 0 }, 'Swap?'],
    ['the same choice twice', { choices: ['Yes', 'Yes'], answer: 0 }, 'Swap?'],
    ['a blank choice', { choices: ['Yes', ' '], answer: 0 }, 'Swap?'],
    ['a choice that is no string', { choices: ['Yes', 1], answer: 0 }, 'Swap?'],
    ['choices that are no list', { choices: 'Yes No', answer: 0 }, 'Swap?'],
    ['an answer past the choices', { choices: ['Yes', 'No'], answer: 2 }, 'Swap?'],
    ['a negative answer', { choices: ['Yes', 'No'], answer: -1 }, 'Swap?'],
    ['an answer that is no whole number', { choices: ['Yes', 'No'], answer: 0.5 }, 'Swap?'],
    ['an answer given as the choice', { choices: ['Yes', 'No'], answer: 'Yes' }, 'Swap?'],
  ])('refuses %s', (_, raw, ask) => {
    expect(parseQuestion(raw, ask)).toBeNull();
  });
});

// A visual of each kind whose one step asks a question, with the step's other keys given
const kinds: [string, (step: Record<string, unknown>) => Record<string, unknown>][] = [
  [
    'array',
    (step) => ({
      type: 'array',
      values: [5, 3],
      caption: 'c',
      steps: [{ compare: [0, 1], ...step }],
    }),
  ],
  [
    'boxes',
    (step) => ({
      type: 'boxes',
      caption: 'c',
      boxes: [{ id: 'a', value: 1, shown: true }],
      steps: [step],
    }),
  ],
  ['tree', (step) => ({ type: 'tree', caption: 'c', nodes: { 0: 8 }, steps: [step] })],
  ['graph', (step) => ({ type: 'graph', caption: 'c', vertices: [[0, 0]], steps: [step] })],
  ['grid', (step) => ({ type: 'grid', caption: 'c', cells: ['..'], steps: [step] })],
  ['stack', (step) => ({ type: 'stack', caption: 'c', steps: [step] })],
];

describe('a question with choices', () => {
  it.each(kinds)('is read in a visual of type %s', (_, make) => {
    const visual = parseVisual(
      JSON.stringify(make({ ask: 'Which?', choices: ['A', 'B'], answer: 1, caption: 'B' })),
    );
    expect(visual?.steps[0]).toMatchObject({
      ask: 'Which?',
      question: { choices: ['A', 'B'], answer: 1 },
    });
  });

  it.each(kinds)('that do not fit make a visual of type %s unreadable', (_, make) => {
    expect(
      parseVisual(JSON.stringify(make({ ask: 'Which?', choices: ['A'], answer: 0, caption: 'A' }))),
    ).toBeNull();
  });
});
