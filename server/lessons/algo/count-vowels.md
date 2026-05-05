# Count Vowels

Given a string `s`, count how many **vowels** it contains. Vowels are `a, e, i, o, u`, both lowercase and uppercase.

### Input
A single line with a string `s`.

### Output
A single integer — the number of vowels in `s`.

### Examples

```
Input:  Hello
Output: 2
```

```
Input:  rhythm
Output: 0
```

```
Input:  OpenAI
Output: 4
```

### Hints
- Make the comparison case-insensitive: convert `s` with `s.lower()`.
- Use a `set` of vowels — checking `ch in vowels` is O(1).
- A `for` loop over `s` plus a counter does the trick.
