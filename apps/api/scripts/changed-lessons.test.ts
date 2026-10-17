import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ENGINE_FILES, RUNTIME_FILES, SELF_FILES, planChecks } from './changed-lessons.js';

// The watched paths are repo-relative, as git diff prints them
const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');

const targetsOf = (shards: ReturnType<typeof planChecks>) =>
  shards.flatMap((s) => s.targets.split(' '));

describe('planChecks', () => {
  // A path that no longer exists never matches a changed file, so a moved
  // runner or engine file would silently stop triggering its regrade.
  it('watches only files that exist', () => {
    const watched = [...Object.values(RUNTIME_FILES).flat(), ...ENGINE_FILES, ...SELF_FILES];
    expect(watched.filter((f) => !fs.existsSync(path.join(REPO_ROOT, f)))).toEqual([]);
  });

  it('plans nothing when no lesson, runner or judge file changed', () => {
    expect(
      planChecks(['apps/ui/src/App.tsx', 'packages/content/lessons/python/loops.md', 'README.md']),
    ).toEqual([]);
  });

  it("grades a changed lesson's spec, solution or variants in EN and RO", () => {
    expect(
      planChecks([
        'packages/content/lessons/java/ro/hashmap-tests.json',
        'packages/content/algorithms/c/binary-search-c-solution.md',
        'packages/content/variants/python/string-reverse/reject-slice-in-helper.py',
        'packages/content/lessons/linux/ls-tests.json',
      ]),
    ).toEqual([
      { name: 'python', image: 'python:3.10-slim', targets: 'python/string-reverse' },
      { name: 'c', image: 'gcc:latest', targets: 'algo-c/binary-search-c' },
      { name: 'java', image: 'eclipse-temurin:21-jdk-alpine', targets: 'java/hashmap' },
    ]);
  });

  it("grades a multi-language lesson's changed spec, solution or variant in that language", () => {
    expect(
      planChecks([
        'packages/content/lessons/trees-graphs/c/ro/trees-tests.json',
        'packages/content/lessons/trees-graphs/java/trees-solution.md',
        'packages/content/variants/trees-graphs/python/trees/reject-no-class.py',
        'packages/content/lessons/trees-graphs/python/trees.md',
      ]),
    ).toEqual([
      { name: 'python', image: 'python:3.10-slim', targets: 'trees-graphs/python/trees' },
      { name: 'c', image: 'gcc:latest', targets: 'trees-graphs/c/trees' },
      { name: 'java', image: 'eclipse-temurin:21-jdk-alpine', targets: 'trees-graphs/java/trees' },
    ]);
  });

  it('grades every lesson of a language, EN only, when its runner changed', () => {
    const shards = planChecks([
      'apps/api/src/services/lesson-tests.runner.java',
      'packages/content/lessons/java/hashmap-tests.json',
    ]);
    expect(shards.map((s) => s.name)).toEqual(['java 1/4', 'java 2/4', 'java 3/4', 'java 4/4']);
    const targets = targetsOf(shards);
    expect(targets).toContain('java/arraylist:en');
    expect(targets).toContain('algo-java/binary-search:en');
    expect(targets).toContain('trees-graphs/java/trees:en');
    // A lesson the PR also changed keeps its RO spec.
    expect(targets).toContain('java/hashmap');
    expect(targets).not.toContain('java/hashmap:en');
    expect(new Set(targets).size).toBe(targets.length);
  });

  it('grades every language when the judge engine shared by all of them changed', () => {
    const names = planChecks(['apps/api/src/services/lesson-tests.service.ts']).map((s) => s.name);
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
