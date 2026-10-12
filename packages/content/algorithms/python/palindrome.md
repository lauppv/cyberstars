Given a string, check whether it is a **palindrome** (reads the same forwards and backwards).

### Input

A single line containing a string `s` of 1 to 10^5 characters (only lowercase letters `a`-`z`, no spaces).

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

```
Input:  abba
Output: True
```

Palindromes can have an even number of characters too. There's no middle
character to ignore, the two halves just need to mirror each other.

```
Input:  ab
Output: False
```
