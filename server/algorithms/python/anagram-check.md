# Anagram Check

Two strings are **anagrams** if they contain the exact same characters, just in a different order. Given two strings, determine if they are anagrams of each other (case-insensitive).

### Input

- Line 1: a string `a`.
- Line 2: a string `b`.

Both strings contain only letters (no spaces or punctuation).

### Output

Print `True` if the strings are anagrams, `False` otherwise.

### Examples

```
Input:
listen
silent

Output:
True
```

```
Input:
hello
world

Output:
False
```

```
Input:
Elvis
Lives

Output:
True
```

The comparison is case-insensitive: `Elvis` and `Lives` only match once both are
lowercased.

```
Input:
aabb
abab

Output:
True
```

Repeated letters still count as a match as long as each letter appears the same
number of times in both strings — order does not matter, only the letter counts.

```
Input:
a
a

Output:
True
```

```
Input:
ab
abc

Output:
False
```

Different lengths can never be anagrams — that is a fast way to rule out a
non-match before comparing letters.

### Hints

- Convert both strings to lowercase first with `.lower()`.
- One approach: sort both strings and compare — `sorted(a) == sorted(b)`.
- Another approach: count the frequency of each letter using a `dict` or `collections.Counter`.
- Anagrams must have the same length, so you can check that first as an early exit.
