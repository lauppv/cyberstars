Combine **built-in functions**, **problem decomposition**, **counter**, **accumulator**, and **flag** patterns

---

## Mission: Mission Log Analyzer

The mission log is a single string of words (already on the right). **Break the work into three functions**, each using a different pattern:

1. `count_word(log, word)` — **counter pattern**: how many times `word` appears in the log
2. `longest_word(log)` — **accumulator pattern**: the longest word in the log
3. `has_duplicate(log)` — **flag pattern**: returns `True` if any word appears more than once

In the main program, also use **built-in functions** — `len()` for the total word count and `sorted()` together with a `set()` for the unique words. Print:

- `Total words: ` then how many words there are
- `Count of scan: ` then how many times `scan` appears
- `Longest word: ` then the longest word
- `Has duplicate: ` then `True` or `False`
- `Unique words: ` then the sorted list of unique words

**Output**

```text
Total words: 7
Count of scan: 3
Longest word: analyze
Has duplicate: True
Unique words: ['analyze', 'boot', 'probe', 'scan']
```
