# Longest Word

Given a sentence, find and print the **longest word**.

### Input
A single line containing a sentence of words separated by spaces.

### Output
Print the longest word in the sentence. If there is a tie, print the one that appears first.

### Examples

```
Input:  I love programming
Output: programming
```

```
Input:  The quick brown fox
Output: quick
```

### Hints
- Use `split()` to break the sentence into a list of words.
- The `len()` function tells you how long a string is.
- You can use `max()` with a `key` argument: `max(words, key=len)`.
