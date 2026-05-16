import { describe, it, expect } from "vitest";
import {
  xpForLesson,
  progressPct,
  computeLevel,
  xpForLevel,
  xpToNextLevel,
  baseLanguage,
  MAIN_COURSE_KEYS,
  ALGO_COURSE_KEYS,
  ALL_COURSE_KEYS,
} from "./constants";

describe("xpForLesson", () => {
  it("scales with lesson position", () => {
    expect(xpForLesson(0)).toBe(10);
    expect(xpForLesson(5)).toBe(15);
    expect(xpForLesson(40)).toBe(50);
  });
});

describe("progressPct", () => {
  it("returns 0 when there are no lessons", () => {
    expect(progressPct(0, 0)).toBe(0);
  });

  it("rounds to the nearest whole percent", () => {
    expect(progressPct(1, 3)).toBe(33);
    expect(progressPct(2, 3)).toBe(67);
    expect(progressPct(1, 2)).toBe(50);
  });

  it("is 100 when everything is complete", () => {
    expect(progressPct(7, 7)).toBe(100);
  });
});

describe("level math", () => {
  it("level 1 starts at 0 XP", () => {
    expect(computeLevel(0)).toBe(1);
    expect(xpForLevel(1)).toBe(0);
  });

  it("computeLevel inverts xpForLevel at every boundary", () => {
    for (let level = 1; level <= 20; level++) {
      expect(computeLevel(xpForLevel(level))).toBe(level);
    }
  });

  it("xpToNextLevel equals the XP span of that level", () => {
    for (let level = 1; level <= 20; level++) {
      const span = xpForLevel(level + 1) - xpForLevel(level);
      expect(xpToNextLevel(level)).toBe(span);
    }
  });

  it("one XP before the next level is still the current level", () => {
    const level5Start = xpForLevel(5);
    expect(computeLevel(level5Start)).toBe(5);
    expect(computeLevel(xpForLevel(6) - 1)).toBe(5);
  });
});

describe("baseLanguage", () => {
  it("strips the algo- prefix", () => {
    expect(baseLanguage("algo-python")).toBe("python");
    expect(baseLanguage("algo-c")).toBe("c");
  });

  it("leaves plain language keys untouched", () => {
    expect(baseLanguage("java")).toBe("java");
  });
});

describe("course key lists", () => {
  it("ALL_COURSE_KEYS is MAIN followed by ALGO", () => {
    expect(ALL_COURSE_KEYS).toEqual([...MAIN_COURSE_KEYS, ...ALGO_COURSE_KEYS]);
  });

  it("every algo key reduces to a known main language", () => {
    for (const key of ALGO_COURSE_KEYS) {
      expect(MAIN_COURSE_KEYS).toContain(baseLanguage(key));
    }
  });
});
