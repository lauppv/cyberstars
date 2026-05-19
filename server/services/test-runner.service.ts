import fs from "fs";
import path from "path";
import { execute } from "./code-execution.service.js";
import type { TestCase, TestResult, SubmitResult } from "../../shared/tests.js";
import { contentDir } from "./paths.js";

export function getTestCases(courseKey: string, lessonSlug: string): TestCase[] | null {
  const filePath = path.join(contentDir(courseKey), `${lessonSlug}-tests.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function applyOverrides(code: string, overrides: Record<string, string>): string {
  let result = code;
  const entries = Object.entries(overrides);
  let allMatched = true;

  for (const [varName, value] of entries) {
    const regex = new RegExp(`^(${varName}[ \\t]*=[ \\t]*).*$`, "m");
    if (regex.test(result)) {
      result = result.replace(regex, `${varName} = ${value}`);
    } else {
      allMatched = false;
    }
  }

  if (!allMatched && entries.length === 1) {
    const [, value] = entries[0];
    result = code.replace(
      /^(\w+[ \t]*=[ \t]*).*$/m,
      (_, prefix) => `${prefix}${value}`
    );
  }

  return result;
}

function checkResult(output: string, testCase: TestCase, code: string): boolean {
  const trimmedOutput = output.trim();

  switch (testCase.mode) {
    case "any":
      return trimmedOutput.length > 0 && trimmedOutput !== "No output.";
    case "contains":
      return trimmedOutput.includes(testCase.expected);
    case "line": {
      const lines = trimmedOutput.split("\n");
      const lineIndex = testCase.line ?? 0;
      if (lineIndex >= lines.length) return false;
      return lines[lineIndex].trim() === testCase.expected;
    }
    case "regex":
      return new RegExp(testCase.expected).test(trimmedOutput);
    case "code_regex":
      return new RegExp(testCase.expected).test(code);
    case "exact":
    default:
      return trimmedOutput === testCase.expected;
  }
}

export async function runTests(
  code: string,
  language: string,
  courseKey: string,
  lessonSlug: string
): Promise<SubmitResult> {
  const tests = getTestCases(courseKey, lessonSlug);
  if (!tests || tests.length === 0) {
    return { passed: 0, total: 0, allPassed: true, results: [] };
  }

  const results: TestResult[] = [];

  for (const testCase of tests) {
    let testCode = code;

    if (testCase.overrides) {
      testCode = applyOverrides(testCode, testCase.overrides);
    }
    if (testCase.append) {
      testCode = testCode + testCase.append;
    }

    const output = await execute(testCode, language, testCase.input);
    const passed = checkResult(output, testCase, code);

    results.push({
      name: testCase.name,
      passed,
      expected: testCase.mode === "any" ? "(any output)" : testCase.mode === "code_regex" ? "(code structure check)" : testCase.expected,
      actual: testCase.mode === "code_regex" ? (passed ? "(found)" : "(not found)") : output.trim(),
    });
  }

  const passed = results.filter((r) => r.passed).length;
  return {
    passed,
    total: results.length,
    allPassed: passed === results.length,
    results,
  };
}
