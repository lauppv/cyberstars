# Palindrome Check

Given a string, check whether it is a **palindrome** (reads the same forwards and backwards).

### Input
A single line containing a string `s` (only lowercase letters, no spaces).

### Output
Print `True` if `s` is a palindrome, `False` otherwise.

### Examples

```
Input:  racecar
Output: True
```

```
Input:  hello
Output: False
```

```
Input:  a
Output: True
```

### Hints
- A string is a palindrome if `s == s[::-1]`.
- You can also compare characters from both ends using a loop.
- Single characters and empty strings are palindromes.
