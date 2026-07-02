# Count Vowels

Given a string, count how many **vowels** it contains.

### Input

A single line containing a string `s`.

### Output

A single integer — the number of vowels (`a`, `e`, `i`, `o`, `u`, case-insensitive) in `s`.

### Examples

```
Input:  hello
Output: 2
```

```
Input:  Python
Output: 1
```

```
Input:  AEIOU
Output: 5
```

```
Input:  xyz
Output: 0
```

No vowels at all is a valid case — the count is simply `0`.

### Hints

- Use `.lower()` to handle both uppercase and lowercase letters.
- Check if each character is `in "aeiou"`.
- A `for` loop with a counter variable works great here.
