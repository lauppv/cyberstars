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

```
Input:
3
abc
def
ghi

Output:
abc
def
ghi
```

When no words are anagrams of each other, every group has exactly one word —
groups are still printed in alphabetical order by their first (and only) word.

```
Input:
1
cat

Output:
cat
```
