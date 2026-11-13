import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  ENGINE_FILES,
  RUNTIME_FILES,
  SECONDS_PER_LESSON,
  SELF_FILES,
  SHARD_SECONDS,
  planChecks,
} from './changed-lessons.js';

// The watched paths are repo-relative, as git diff prints them
const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');

const targetsOf = (shards: ReturnType<typeof planChecks>) =>
  shards.flatMap((s) => s.targets.split(' '));

// 'java 2/7' -> 'java', 'web' -> 'web'.
const runtimeOf = (name: string) => name.split(' ')[0] as keyof typeof SECONDS_PER_LESSON;

// Every shard fits the budget, and one fewer of its runtime's wouldn't.
function expectShardsFit(shards: ReturnType<typeof planChecks>) {
  for (const s of shards) {
    const runtime = runtimeOf(s.name);
    const lessons = s.targets.split(' ').length;
    expect(lessons * SECONDS_PER_LESSON[runtime], s.name).toBeLessThanOrEqual(SHARD_SECONDS);
  }
  for (const runtime of new Set(shards.map((s) => runtimeOf(s.name)))) {
    const own = shards.filter((s) => runtimeOf(s.name) === runtime);
    const lessons = targetsOf(own).length;
    const perShard = Math.floor(SHARD_SECONDS / SECONDS_PER_LESSON[runtime]);
    expect(own.length, runtime).toBe(Math.ceil(lessons / perShard));
    if (own.length > 1) {
      expect(own.map((s) => s.name)).toEqual(
        own.map((_, i) => `${runtime} ${i + 1}/${own.length}`),
      );
    }
  }
}

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

  it("grades a changed lesson's spec, solution, hidden part or variants in EN and RO", () => {
    expect(
      planChecks([
        'packages/content/lessons/java/ro/hashmap-tests.json',
        'packages/content/algorithms/c/binary-search-c-harness.md',
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

  it("grades a multi-language challenge's changed spec, hidden part or variant in that language", () => {
    expect(
      planChecks([
        'packages/content/algorithms/trees-graphs/c/max-depth-tests.json',
        'packages/content/algorithms/trees-graphs/java/ro/max-depth-harness.md',
        'packages/content/variants/algo-trees-graphs/python/max-depth/reject-counts-edges.py',
      ]),
    ).toEqual([
      { name: 'python', image: 'python:3.10-slim', targets: 'algo-trees-graphs/python/max-depth' },
      { name: 'c', image: 'gcc:latest', targets: 'algo-trees-graphs/c/max-depth' },
      {
        name: 'java',
        image: 'eclipse-temurin:21-jdk-alpine',
        targets: 'algo-trees-graphs/java/max-depth',
      },
    ]);
  });

  it('grades every lesson of a language, EN only, when its runner changed', () => {
    const shards = planChecks([
      'apps/api/src/services/lesson-tests.runner.java',
      'packages/content/lessons/java/hashmap-tests.json',
    ]);
    expect(new Set(shards.map((s) => runtimeOf(s.name)))).toEqual(new Set(['java']));
    expect(shards.length).toBeGreaterThan(1);
    expectShardsFit(shards);
    const targets = targetsOf(shards);
    expect(targets).toContain('java/arraylist:en');
    expect(targets).toContain('algo-java/binary-search:en');
    expect(targets).toContain('trees-graphs/java/trees:en');
    expect(targets).toContain('algo-trees-graphs/java/max-depth:en');
    // A lesson the PR also changed keeps its RO spec.
    expect(targets).toContain('java/hashmap');
    expect(targets).not.toContain('java/hashmap:en');
    expect(new Set(targets).size).toBe(targets.length);
  });

  it('grades every language when the judge engine shared by all of them changed', () => {
    const shards = planChecks(['apps/api/src/services/lesson-tests.service.ts']);
    expect([...new Set(shards.map((s) => runtimeOf(s.name)))]).toEqual([
      'python',
      'c',
      'java',
      'web',
    ]);
    expectShardsFit(shards);
  });

  it("grades every language when the judge's shared types changed", () => {
    const shards = planChecks(['packages/shared/tests.ts']);
    expect([...new Set(shards.map((s) => runtimeOf(s.name)))]).toEqual([
      'python',
      'c',
      'java',
      'web',
    ]);
    expectShardsFit(shards);
  });

  // A PR that rewrites many lessons of a course (CYB-113 changed 291 web
  // lessons) is split like a whole language, not left in one long job.
  it('splits many changed lessons into shards that fit the budget', () => {
    const changed = fs
      .readdirSync(path.join(REPO_ROOT, 'packages/content/lessons/web-dev'))
      .filter((f) => f.endsWith('-tests.json'))
      .map((f) => `packages/content/lessons/web-dev/${f}`);
    const shards = planChecks(changed);
    expect(shards.length).toBeGreaterThan(1);
    expectShardsFit(shards);
    const targets = targetsOf(shards);
    expect(targets).toHaveLength(changed.length);
    expect(targets.some((t) => t.includes(':'))).toBe(false);
  });

  it('grades one lesson per language when only the planner or its workflow changed', () => {
    const shards = planChecks(['.github/workflows/lesson-tests.yml']);
    expect(shards.map((s) => s.name)).toEqual(['python', 'c', 'java', 'web']);
    for (const s of shards) expect(s.targets).toMatch(/^[a-z-]+\/[a-z0-9-]+:en$/);
  });

  it('grades a web lesson in an image built from the repo, and every one when its judge changed', () => {
    expect(
      planChecks([
        'packages/content/lessons/web-dev/first-page-tests.json',
        'packages/content/variants/web-dev/first-page/reject-no-lang.md',
      ]),
    ).toEqual([
      {
        name: 'web',
        image: 'cyberstars-web-sandbox',
        build: 'apps/api/src/runtimes/web-sandbox',
        targets: 'web-dev/first-page',
      },
    ]);
    const shards = planChecks(['apps/api/src/services/lesson-tests.runner.web.cjs']);
    expect(new Set(shards.map((s) => runtimeOf(s.name)))).toEqual(new Set(['web']));
    expectShardsFit(shards);
    for (const s of shards) expect(s.build).toBe('apps/api/src/runtimes/web-sandbox');
    expect(targetsOf(shards)).toContain('web-dev/first-page:en');
  });

  it('grades every lesson in EN and RO on a manual run', () => {
    const targets = targetsOf(planChecks([], true));
    expect(targets).toContain('python/booleans');
    expect(targets).toContain('algo-c/binary-search-c');
    expect(targets.some((t) => t.includes(':'))).toBe(false);
  });
});
