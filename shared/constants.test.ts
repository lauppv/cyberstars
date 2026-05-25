import { describe, it, expect } from "vitest";
import {
  progressPct,
  baseLanguage,
  MAIN_COURSE_KEYS,
  ALGO_COURSE_KEYS,
  ALL_COURSE_KEYS,
} from "./constants";

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
