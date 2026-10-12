import { describe, it, expect } from 'vitest';
import { planChecks } from './changed-lessons.js';

const targetsOf = (shards: ReturnType<typeof planChecks>) =>
  shards.flatMap((s) => s.targets.split(' '));

describe('planChecks', () => {
  it('plans nothing when no lesson, runner or judge file changed', () => {
    expect(
      planChecks(['apps/ui/src/App.tsx', 'server/lessons/python/loops.md', 'README.md']),
    ).toEqual([]);
  });

  it("grades a changed lesson's spec, solution or variants in EN and RO", () => {
    expect(
      planChecks([
        'server/lessons/java/ro/hashmap-tests.json',
        'server/algorithms/c/binary-search-c-solution.md',
        'test/lesson-variants/python/string-reverse/reject-slice-in-helper.py',
        'server/lessons/linux/ls-tests.json',
      ]),
    ).toEqual([
      { name: 'python', image: 'python:3.10-slim', targets: 'python/string-reverse' },
      { name: 'c', image: 'gcc:latest', targets: 'algo-c/binary-search-c' },
      { name: 'java', image: 'eclipse-temurin:21-jdk-alpine', targets: 'java/hashmap' },
    ]);
  });

  it('grades every lesson of a language, EN only, when its runner changed', () => {
    const shards = planChecks([
      'server/services/lesson-tests.runner.java',
      'server/lessons/java/hashmap-tests.json',
    ]);
    expect(shards.map((s) => s.name)).toEqual(['java 1/4', 'java 2/4', 'java 3/4', 'java 4/4']);
    const targets = targetsOf(shards);
    expect(targets).toContain('java/arraylist:en');
    expect(targets).toContain('algo-java/binary-search:en');
    // A lesson the PR also changed keeps its RO spec.
    expect(targets).toContain('java/hashmap');
    expect(targets).not.toContain('java/hashmap:en');
    expect(new Set(targets).size).toBe(targets.length);
  });

  it('grades every language when the judge engine shared by all of them changed', () => {
    const names = planChecks(['server/services/lesson-tests.service.ts']).map((s) => s.name);
    expect(names).toEqual([
      'python 1/2',
      'python 2/2',
      'c',
      'java 1/4',
      'java 2/4',
      'java 3/4',
      'java 4/4',
    ]);
  });

  it("grades every language when the judge's shared types changed", () => {
    const names = planChecks(['packages/shared/tests.ts']).map((s) => s.name);
    expect(names).toEqual([
      'python 1/2',
      'python 2/2',
      'c',
      'java 1/4',
      'java 2/4',
      'java 3/4',
      'java 4/4',
    ]);
  });

  it('grades one lesson per language when only the planner or its workflow changed', () => {
    const shards = planChecks(['.github/workflows/lesson-tests.yml']);
    expect(shards.map((s) => s.name)).toEqual(['python', 'c', 'java']);
    for (const s of shards) expect(s.targets).toMatch(/^[a-z]+\/[a-z0-9-]+:en$/);
  });

  it('grades every lesson in EN and RO on a manual run', () => {
    const targets = targetsOf(planChecks([], true));
    expect(targets).toContain('python/booleans');
    expect(targets).toContain('algo-c/binary-search-c');
    expect(targets.some((t) => t.includes(':'))).toBe(false);
  });
});
