Combine **scope**, **default parameters**, **multiple return values**, and **try/except**

---

## Mission: Telemetry Toolkit

Build a small toolkit. Each function should work only with its **parameters** and **return** its result (good scope discipline).

1. `safe_int(text, fallback=0)` — uses **try/except** to turn `text` into an int. If `int()` fails, return `fallback`. The `fallback` parameter has a **default** of `0`.
2. `summarize(numbers)` — returns **three values**: the total, the largest, and the smallest of a list of numbers.

In the main program, the readings are already on the right (some are corrupted). Then:

- go through `readings` and use `safe_int` on each to build a list called `numbers` (corrupted readings become `0`)
- print `Numbers: ` then that list
- call `summarize(numbers)`, **unpack** the three values, and print `Total:`, `Largest:`, and `Smallest:`

**Output**

```text
Numbers: [10, 0, 25, 7, 0]
Total: 42
Largest: 25
Smallest: 0
```
