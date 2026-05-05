# Anagram Check

Two strings are **anagrams** if one can be rearranged to form the other — same letters, same counts, possibly different order.

Read two lines from input. Print `true` if they are anagrams of each other, otherwise `false`. Comparisons are **case-insensitive** and you should **ignore spaces**.

### Input
- Line 1: string `a`
- Line 2: string `b`

### Output
A single line: `true` or `false`.

### Examples

```
Input:
listen
silent

Output:
true
```

```
Input:
hello
world

Output:
false
```

```
Input:
Dormitory
Dirty room

Output:
true
```

### Hints
- Normalize both strings: lowercase, then strip spaces (`s.replace(" ", "")`).
- An easy check: `sorted(a) == sorted(b)`.
- Or count letters with `collections.Counter` — same idea, O(n).
- Print exactly `true` / `false` (lowercase).
