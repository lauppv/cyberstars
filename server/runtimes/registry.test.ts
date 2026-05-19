import { describe, it, expect } from "vitest";
import { getRuntime } from "./registry.js";

describe("getRuntime", () => {
  it("returns runtime for supported languages", () => {
    expect(getRuntime("python")).not.toBeNull();
    expect(getRuntime("c")).not.toBeNull();
    expect(getRuntime("java")).not.toBeNull();
  });

  it("returns runtime for algo variants", () => {
    expect(getRuntime("algo-python")).not.toBeNull();
    expect(getRuntime("algo-java")).not.toBeNull();
    expect(getRuntime("algo-c")).not.toBeNull();
  });

  it("is case-insensitive", () => {
    expect(getRuntime("Python")).not.toBeNull();
    expect(getRuntime("JAVA")).not.toBeNull();
  });

  it("returns null for unsupported language", () => {
    expect(getRuntime("ruby")).toBeNull();
    expect(getRuntime("")).toBeNull();
  });
});
