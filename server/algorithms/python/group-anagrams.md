# Hard · Group Anagrams

Given a list of words, group all **anagrams** together. Two words are anagrams if they contain the same letters in a different order (e.g., "listen" and "silent").

Print each group on a separate line with words sorted alphabetically within the group. Sort groups by their first word (alphabetically).

### Input

- Line 1: an integer `n` — the number of words.
- Next `n` lines: one word per line (lowercase letters only).

### Output

One group per line. Words within each group are sorted alphabetically and separated by spaces. Groups are sorted by their first word.

### Examples

```
Input:
6
eat
tea
tan
ate
nat
bat

Output:
ate eat tea
bat
nat tan
```

```
Input:
3
listen
silent
hello

Output:
hello
listen silent
```

### Hints

- Two words are anagrams if sorting their characters gives the same string: `sorted("eat") == sorted("tea")`.
- Use a dictionary with the sorted characters as the key, and a list of words as the value.
- After grouping, sort each group alphabetically, then sort all groups by their first word.
- `collections.defaultdict(list)` is handy for building the groups.
