import { useState, useRef } from "react";
import { Topbar } from "../components/layout/Topbar";
import { useGamification } from "../hooks/useGamification";

interface Challenge {
  id: number;
  name: string;
  diff: "easy" | "medium" | "hard";
  xp: number;
  solved: boolean;
  category: string;
  desc: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  starter: string;
  tests: string[];
}

const PY_KW = [
  "def", "class", "if", "elif", "else", "for", "while", "return", "import", "from",
  "as", "try", "except", "finally", "with", "yield", "lambda", "pass", "break",
  "continue", "and", "or", "not", "in", "is", "True", "False", "None", "print",
  "range", "len", "input", "int", "str", "float", "list", "dict", "set", "tuple", "type", "self",
];

function hlPy(code: string): string {
  let h = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  h = h.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, '<span class="syn-str">$&</span>');
  h = h.replace(/(#.*$)/gm, '<span class="syn-cmt">$&</span>');
  h = h.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$&</span>');
  const p = new RegExp("\\b(" + PY_KW.join("|") + ")\\b", "g");
  h = h.replace(p, '<span class="syn-kw">$&</span>');
  return h;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1, name: "Two Sum", diff: "easy", xp: 25, solved: true,
    category: "arrays",
    desc: 'Given a list of integers <code>nums</code> and an integer <code>target</code>, return the <strong>indices</strong> of the two numbers that add up to the target.\n\nYou may assume each input has <strong>exactly one solution</strong>, and you may not use the same element twice.',
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6" },
    ],
    constraints: ["2 ≤ len(nums) ≤ 100", "-1000 ≤ nums[i] ≤ 1000", "Exactly one valid answer exists"],
    starter: 'def two_sum(nums, target):\n    # Your code here\n    pass\n\n# Test\nprint(two_sum([2, 7, 11, 15], 9))',
    tests: ["two_sum([2,7,11,15], 9) → [0,1]", "two_sum([3,2,4], 6) → [1,2]", "two_sum([3,3], 6) → [0,1]"],
  },
  {
    id: 2, name: "Reverse String", diff: "easy", xp: 20, solved: true,
    category: "strings",
    desc: 'Write a function that takes a string and returns it <strong>reversed</strong>.\n\nDo not use the built-in <code>[::-1]</code> slicing — implement it manually using a loop.',
    examples: [
      { input: '"hello"', output: '"olleh"', explanation: "Characters are reversed" },
      { input: '"Python"', output: '"nohtyP"', explanation: "" },
    ],
    constraints: ["1 ≤ len(s) ≤ 1000", "s contains only printable ASCII"],
    starter: 'def reverse_string(s):\n    # Your code here\n    pass\n\n# Test\nprint(reverse_string("hello"))',
    tests: ['reverse_string("hello") → "olleh"', 'reverse_string("a") → "a"', 'reverse_string("ab") → "ba"'],
  },
  {
    id: 3, name: "FizzBuzz", diff: "easy", xp: 20, solved: false,
    category: "loops",
    desc: 'Write a function that returns a list of strings for numbers from 1 to <code>n</code>:\n\n• For multiples of <strong>3</strong>, use <code>"Fizz"</code>\n• For multiples of <strong>5</strong>, use <code>"Buzz"</code>\n• For multiples of <strong>both 3 and 5</strong>, use <code>"FizzBuzz"</code>\n• Otherwise, use the number as a string',
    examples: [
      { input: "n = 5", output: '["1", "2", "Fizz", "4", "Buzz"]', explanation: "3 → Fizz, 5 → Buzz" },
      { input: "n = 15", output: '[..., "14", "FizzBuzz"]', explanation: "15 is divisible by both 3 and 5" },
    ],
    constraints: ["1 ≤ n ≤ 10000"],
    starter: "def fizzbuzz(n):\n    result = []\n    for i in range(1, n + 1):\n        # Your code here\n        pass\n    return result\n\n# Test\nprint(fizzbuzz(15))",
    tests: ['fizzbuzz(3) → ["1","2","Fizz"]', 'fizzbuzz(5)[-1] → "Buzz"', 'fizzbuzz(15)[-1] → "FizzBuzz"'],
  },
  {
    id: 4, name: "Palindrome Check", diff: "easy", xp: 25, solved: false,
    category: "strings",
    desc: 'Write a function that checks if a given string is a <strong>palindrome</strong> (reads the same forwards and backwards).\n\nIgnore case and non-alphanumeric characters.',
    examples: [
      { input: '"racecar"', output: "True", explanation: "racecar reads the same backwards" },
      { input: '"A man a plan a canal Panama"', output: "True", explanation: "Ignoring spaces and case" },
      { input: '"hello"', output: "False", explanation: "" },
    ],
    constraints: ["1 ≤ len(s) ≤ 10000"],
    starter: 'def is_palindrome(s):\n    # Your code here\n    pass\n\n# Test\nprint(is_palindrome("racecar"))\nprint(is_palindrome("hello"))',
    tests: ['is_palindrome("racecar") → True', 'is_palindrome("hello") → False', 'is_palindrome("A man a plan a canal Panama") → True'],
  },
  {
    id: 5, name: "Max Subarray Sum", diff: "medium", xp: 50, solved: false,
    category: "arrays",
    desc: "Given an array of integers, find the <strong>contiguous subarray</strong> with the largest sum and return that sum.\n\nThis is a classic problem known as <strong>Kadane's Algorithm</strong>.",
    examples: [
      { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", output: "6", explanation: "Subarray [4, -1, 2, 1] has the largest sum" },
      { input: "[1]", output: "1", explanation: "Single element" },
    ],
    constraints: ["1 ≤ len(nums) ≤ 10000", "-10000 ≤ nums[i] ≤ 10000"],
    starter: "def max_subarray(nums):\n    # Your code here\n    pass\n\n# Test\nprint(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))",
    tests: ["max_subarray([-2,1,-3,4,-1,2,1,-5,4]) → 6", "max_subarray([1]) → 1", "max_subarray([-1,-2,-3]) → -1"],
  },
  {
    id: 6, name: "Valid Parentheses", diff: "medium", xp: 50, solved: false,
    category: "strings",
    desc: 'Given a string containing only <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>[</code>, <code>]</code>, determine if the input string has <strong>valid bracket matching</strong>.\n\nEvery opening bracket must be closed by the same type in the correct order.',
    examples: [
      { input: '"()[]{}"', output: "True", explanation: "All brackets properly closed" },
      { input: '"(]"', output: "False", explanation: "Mismatched types" },
      { input: '"{[]}"', output: "True", explanation: "Nested correctly" },
    ],
    constraints: ["0 ≤ len(s) ≤ 10000", "s contains only bracket characters"],
    starter: 'def is_valid(s):\n    # Hint: use a stack!\n    pass\n\n# Test\nprint(is_valid("()[]{}"))\nprint(is_valid("(]"))',
    tests: ['is_valid("()[]{}") → True', 'is_valid("(]") → False', 'is_valid("{[]}") → True'],
  },
  {
    id: 7, name: "Count Words", diff: "easy", xp: 20, solved: false,
    category: "strings",
    desc: 'Write a function that counts the number of <strong>words</strong> in a string. Words are separated by spaces. Multiple consecutive spaces should be treated as a single separator.',
    examples: [
      { input: '"Hello World"', output: "2", explanation: "Two words" },
      { input: '"  spaces   everywhere  "', output: "2", explanation: "Leading/trailing/multiple spaces ignored" },
    ],
    constraints: ["0 ≤ len(s) ≤ 10000"],
    starter: 'def count_words(s):\n    # Your code here\n    pass\n\n# Test\nprint(count_words("Hello World"))',
    tests: ['count_words("Hello World") → 2', 'count_words("") → 0', 'count_words("  a  b  ") → 2'],
  },
  {
    id: 8, name: "Matrix Spiral", diff: "hard", xp: 100, solved: false,
    category: "arrays",
    desc: 'Given an <code>m × n</code> matrix, return all elements in <strong>spiral order</strong> — starting from the top-left, going right, then down, then left, then up, and repeating inward.',
    examples: [
      { input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]", explanation: "Spiral from outside in" },
    ],
    constraints: ["1 ≤ m, n ≤ 100", "-1000 ≤ matrix[i][j] ≤ 1000"],
    starter: "def spiral_order(matrix):\n    # Your code here\n    pass\n\n# Test\nprint(spiral_order([\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]))",
    tests: ["spiral_order([[1,2,3],[4,5,6],[7,8,9]]) → [1,2,3,6,9,8,7,4,5]", "spiral_order([[1]]) → [1]", "spiral_order([[1,2],[3,4]]) → [1,2,4,3]"],
  },
  {
    id: 9, name: "Bubble Sort", diff: "medium", xp: 40, solved: false,
    category: "loops",
    desc: "Implement the <strong>bubble sort</strong> algorithm. Repeatedly step through the list, compare adjacent elements, and swap them if they are in the wrong order.",
    examples: [
      { input: "[64, 34, 25, 12, 22]", output: "[12, 22, 25, 34, 64]", explanation: "Sorted in ascending order" },
    ],
    constraints: ["1 ≤ len(arr) ≤ 1000"],
    starter: "def bubble_sort(arr):\n    # Your code here\n    pass\n\n# Test\nprint(bubble_sort([64, 34, 25, 12, 22]))",
    tests: ["bubble_sort([64,34,25,12,22]) → [12,22,25,34,64]", "bubble_sort([1]) → [1]", "bubble_sort([3,1,2]) → [1,2,3]"],
  },
  {
    id: 10, name: "Flatten Nested List", diff: "hard", xp: 80, solved: false,
    category: "arrays",
    desc: 'Write a function that takes a <strong>deeply nested list</strong> and returns a <strong>flat list</strong> of all values, preserving order. Use <strong>recursion</strong>.',
    examples: [
      { input: "[1, [2, [3, 4], 5], 6]", output: "[1, 2, 3, 4, 5, 6]", explanation: "All nesting removed" },
    ],
    constraints: ["List can be nested to any depth", "Values are always integers"],
    starter: "def flatten(lst):\n    # Your code here (use recursion!)\n    pass\n\n# Test\nprint(flatten([1, [2, [3, 4], 5], 6]))",
    tests: ["flatten([1,[2,[3,4],5],6]) → [1,2,3,4,5,6]", "flatten([1,2,3]) → [1,2,3]", "flatten([[[[1]]]]) → [1]"],
  },
];

const CATEGORIES = ["all", "arrays", "strings", "loops"];
const DIFFS = ["all", "easy", "medium", "hard"] as const;

const DIFF_COLORS: Record<string, { bg: string; text: string }> = {
  easy: { bg: "rgba(0,214,143,0.12)", text: "var(--success)" },
  medium: { bg: "rgba(255,170,0,0.12)", text: "var(--warning)" },
  hard: { bg: "rgba(255,107,107,0.12)", text: "var(--error)" },
};

export function ChallengesPage() {
  const g = useGamification();
  const [selectedId, setSelectedId] = useState(1);
  const [catFilter, setCatFilter] = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");
  const [codes, setCodes] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, { output: string | null; tests: { label: string; detail: string; pass: boolean }[] | null }>>({});
  const [running, setRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resultTab, setResultTab] = useState<"output" | "tests">("output");
  const preRef = useRef<HTMLPreElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const challenge = CHALLENGES.find((c) => c.id === selectedId)!;
  const code = codes[selectedId] || challenge.starter;

  const filtered = CHALLENGES.filter((c) => {
    if (catFilter !== "all" && c.category !== catFilter) return false;
    if (diffFilter !== "all" && c.diff !== diffFilter) return false;
    return true;
  });

  const setCode = (v: string) => setCodes({ ...codes, [selectedId]: v });

  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const handleRun = () => {
    setRunning(true);
    setResultTab("output");
    setTimeout(() => {
      const prints = code.match(/print\s*\(([^)]*)\)/g);
      const output = prints
        ? prints.map((m) => {
            const inner = m.match(/\(([^)]*)\)/);
            return inner ? inner[1].replace(/["']/g, "").trim() || "(empty)" : "";
          }).join("\n")
        : "✓ No output";
      setResults({ ...results, [selectedId]: { output, tests: null } });
      setRunning(false);
    }, 800);
  };

  const handleSubmit = () => {
    setRunning(true);
    setResultTab("tests");
    setTimeout(() => {
      const testResults = challenge.tests.map((t, i) => ({
        label: "Test " + (i + 1),
        detail: t,
        pass: Math.random() > 0.2,
      }));
      const allPass = testResults.every((t) => t.pass);
      setResults({ ...results, [selectedId]: { output: null, tests: testResults } });
      setRunning(false);
      if (allPass) {
        setTimeout(() => setShowSuccess(true), 300);
      }
    }, 1500);
  };

  const lines = code.split("\n");
  const currentResult = results[selectedId];
  const dc = DIFF_COLORS[challenge.diff];

  return (
    <>
      <style>{`
        .syn-kw { color: #FF79C6; }
        .syn-str { color: #F1FA8C; }
        .syn-num { color: #BD93F9; }
        .syn-cmt { color: #6272A4; font-style: italic; }
        @keyframes popIn { from { opacity: 0; transform: scale(.9); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="h-screen flex flex-col bg-transparent text-[var(--text)] overflow-hidden">
        <Topbar streak={g.streak} />

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Challenge list */}
          <div className="w-[360px] flex-shrink-0 bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] border-r border-[var(--accent)]/30 flex flex-col overflow-hidden">
            <div className="p-5 pb-4">
              <div className="text-lg font-bold mb-3" style={{ letterSpacing: "-0.3px" }}>
                Challenges
              </div>
              {/* Category chips */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCatFilter(c)}
                    className={`px-3 py-1 rounded-[14px] text-[11px] font-semibold cursor-pointer transition-all ${
                      catFilter === c
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                        : "bg-transparent border border-[var(--border)] text-[var(--text3)] hover:border-[var(--text3)] hover:text-[var(--text)]"
                    }`}
                  >
                    {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
              {/* Difficulty chips */}
              <div className="flex gap-1">
                {DIFFS.map((d) => {
                  const isActive = diffFilter === d;
                  const dc2 = d !== "all" ? DIFF_COLORS[d] : null;
                  return (
                    <button
                      key={d}
                      onClick={() => setDiffFilter(d)}
                      className="px-2.5 py-1 rounded-[10px] border-none text-[10px] font-semibold cursor-pointer transition-all"
                      style={{
                        background: isActive && dc2 ? dc2.bg : isActive ? "var(--surface2)" : "var(--bg3)",
                        color: dc2 ? dc2.text : "var(--text2)",
                      }}
                    >
                      {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2 pb-3">
              {filtered.map((c) => {
                const isActive = c.id === selectedId;
                const dc2 = DIFF_COLORS[c.diff];
                return (
                  <div
                    key={c.id}
                    onClick={() => { setSelectedId(c.id); setResultTab("output"); }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-[var(--radius-sm)] cursor-pointer transition-all mb-0.5 ${
                      isActive
                        ? "bg-[rgba(108,92,231,0.07)] border border-[rgba(108,92,231,0.2)]"
                        : "border border-transparent hover:bg-[var(--surface)]"
                    } ${c.solved ? "opacity-70" : ""}`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{
                        background: c.solved ? "var(--success)" : dc2.bg,
                        color: c.solved ? "#fff" : dc2.text,
                      }}
                    >
                      {c.solved ? "✓" : c.diff === "easy" ? "E" : c.diff === "medium" ? "M" : "H"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold mb-0.5 truncate">{c.name}</div>
                      <span className="text-[9px] px-1.5 py-px rounded-md bg-[var(--bg3)] text-[var(--text3)] font-medium">
                        {c.category}
                      </span>
                    </div>
                    {c.solved ? (
                      <span className="text-[10px] text-[var(--success)] font-semibold flex-shrink-0">Solved</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[var(--accent)] flex-shrink-0">+{c.xp}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main pane */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Problem header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-[10px] uppercase tracking-[0.5px]"
                  style={{ background: dc.bg, color: dc.text }}
                >
                  {challenge.diff}
                </span>
                <span className="text-[17px] font-bold" style={{ letterSpacing: "-0.2px" }}>
                  {challenge.name}
                </span>
              </div>
              <span className="text-[13px] font-semibold text-[var(--accent)]">+{challenge.xp} XP</span>
            </div>

            {/* Split pane */}
            <div className="flex-1 flex overflow-hidden">
              {/* Problem description */}
              <div className="flex-1 overflow-y-auto p-6 border-r border-[var(--border)]">
                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.8px] text-[var(--text3)] mb-2">
                    Description
                  </div>
                  <div
                    className="text-sm leading-[1.7] text-[var(--text2)] [&_strong]:text-[var(--text)] [&_code]:font-[var(--mono)] [&_code]:text-xs [&_code]:bg-[var(--surface2)] [&_code]:px-1.5 [&_code]:py-px [&_code]:rounded [&_code]:text-[var(--accent)]"
                    dangerouslySetInnerHTML={{ __html: challenge.desc.replace(/\n/g, "<br/>") }}
                  />
                </div>

                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.8px] text-[var(--text3)] mb-2">
                    Examples
                  </div>
                  {challenge.examples.map((ex, i) => (
                    <div key={i} className="bg-[var(--bg3)] rounded-[var(--radius-sm)] px-3.5 py-3 my-2.5 font-[var(--mono)] text-xs leading-relaxed">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[var(--text3)] mb-1 font-[var(--font)]">
                        Example {i + 1}
                      </div>
                      <div className="text-[var(--text2)]">
                        <strong className="text-[var(--success)]">Input: </strong>{ex.input}<br />
                        <strong className="text-[var(--success)]">Output: </strong>{ex.output}
                        {ex.explanation && (
                          <>
                            <br />
                            <strong className="text-[var(--success)]">Why: </strong>{ex.explanation}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.8px] text-[var(--text3)] mb-2">
                    Constraints
                  </div>
                  <ul className="flex flex-col gap-1">
                    {challenge.constraints.map((c, i) => (
                      <li key={i} className="text-xs text-[var(--text2)] pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--accent)]">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Editor panel */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Editor toolbar */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-[var(--bg3)] border-b border-[var(--border)] flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text2)]">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#3572A5" }} />
                    Python 3
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleRun}
                      disabled={running}
                      className="px-3 py-[5px] rounded-[var(--radius-sm)] bg-[var(--surface2)] text-[var(--text)] text-xs font-semibold cursor-pointer hover:bg-[var(--surface)] transition flex items-center gap-1 border-none disabled:opacity-50"
                    >
                      ▶ Run
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={running}
                      className="px-3 py-[5px] rounded-[var(--radius-sm)] bg-[var(--success)] text-black text-xs font-semibold cursor-pointer hover:brightness-110 transition flex items-center gap-1 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {running ? (
                        <>
                          <span className="inline-block w-3 h-3 border-2 border-black/25 border-t-current rounded-full animate-spin" />
                          {" Testing..."}
                        </>
                      ) : (
                        <>⬡ Submit</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code editor */}
                <div className="flex-1 flex overflow-hidden min-h-0" style={{ background: "#0D1117" }}>
                  {/* Line numbers */}
                  <div className="py-3 w-9 flex-shrink-0 text-right border-r border-[#1E2430]" style={{ background: "#0D111780" }}>
                    {lines.map((_, i) => (
                      <div key={i} className="px-1.5 font-[var(--mono)] text-xs leading-[1.65] text-[#444D60] select-none">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  {/* Code area */}
                  <div className="flex-1 relative overflow-auto">
                    <pre
                      ref={preRef}
                      className="absolute inset-0 p-3 font-[var(--mono)] text-xs leading-[1.65] text-[var(--text)] pointer-events-none overflow-auto whitespace-pre"
                      style={{ tabSize: 4 }}
                      dangerouslySetInnerHTML={{ __html: hlPy(code) + "\n" }}
                    />
                    <textarea
                      ref={taRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onScroll={syncScroll}
                      spellCheck={false}
                      className="absolute inset-0 w-full h-full p-3 font-[var(--mono)] text-xs leading-[1.65] text-transparent bg-transparent border-none outline-none resize-none overflow-auto"
                      style={{ tabSize: 4, caretColor: "var(--text)", WebkitTextFillColor: "transparent" }}
                    />
                  </div>
                </div>

                {/* Result panel */}
                {currentResult && (
                  <div className="border-t border-[var(--border)] flex-shrink-0 max-h-40 overflow-y-auto" style={{ background: "#0A0E14" }}>
                    <div className="flex border-b border-[var(--border)]">
                      <button
                        onClick={() => setResultTab("output")}
                        className={`px-3.5 py-[7px] text-[11px] font-semibold cursor-pointer border-none bg-transparent transition-all ${
                          resultTab === "output" ? "text-[var(--text)] shadow-[inset_0_-2px_0_var(--accent)]" : "text-[var(--text3)]"
                        }`}
                      >
                        ⬡ Output
                      </button>
                      {currentResult.tests && (
                        <button
                          onClick={() => setResultTab("tests")}
                          className={`px-3.5 py-[7px] text-[11px] font-semibold cursor-pointer border-none bg-transparent transition-all ${
                            resultTab === "tests" ? "text-[var(--text)] shadow-[inset_0_-2px_0_var(--accent)]" : "text-[var(--text3)]"
                          }`}
                        >
                          ✓ Test Results
                        </button>
                      )}
                    </div>
                    {resultTab === "output" && currentResult.output && (
                      <div className="px-3.5 py-2.5 font-[var(--mono)] text-xs leading-relaxed text-[var(--success)] whitespace-pre-wrap">
                        {currentResult.output}
                      </div>
                    )}
                    {resultTab === "tests" && currentResult.tests && (
                      <div className="px-3.5 py-2.5 flex flex-col gap-1.5">
                        {currentResult.tests.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div
                              className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                              style={{
                                background: t.pass ? "rgba(0,214,143,0.15)" : "rgba(255,107,107,0.15)",
                                color: t.pass ? "var(--success)" : "var(--error)",
                              }}
                            >
                              {t.pass ? "✓" : "✗"}
                            </div>
                            <span className="text-[var(--text2)]">{t.label}</span>
                            <span className="text-[var(--text3)] font-[var(--mono)] text-[11px] ml-auto">{t.detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success modal */}
        {showSuccess && (
          <div
            className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center animate-fade-in"
            onClick={() => setShowSuccess(false)}
          >
            <div
              className="bg-[var(--bg2)] border border-[var(--accent)] rounded-2xl p-9 text-center max-w-[380px]"
              style={{ animation: "popIn 0.3s cubic-bezier(.22,1,.36,1)", boxShadow: "0 0 40px var(--accent-glow)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[52px] mb-3">🏆</div>
              <div className="text-[22px] font-bold mb-1.5">Challenge Solved!</div>
              <div className="text-base font-semibold text-[var(--accent)] mb-4">+{challenge.xp} XP earned</div>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-7 py-2.5 bg-[var(--accent)] text-white rounded-[var(--radius)] text-sm font-semibold cursor-pointer border-none hover:brightness-110 transition"
              >
                Next Challenge →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
