# Caesar Cipher

Encrypt a string using the **Caesar cipher**: shift every letter forward by a given number of positions in the alphabet. Non-letter characters stay the same.

### Input

- Line 1: a string `s` (may contain uppercase, lowercase letters, spaces, and punctuation).
- Line 2: an integer `shift` (1-25).

### Output

The encrypted string, preserving the original case of each letter.

### Examples

```
Input:
abc
3

Output:
def
```

```
Input:
Hello, World!
5

Output:
Mjqqt, Btwqi!
```

```
Input:
az
1

Output:
ba
```

The alphabet wraps around: shifting `z` by 1 lands back on `a`.

```
Input:
Zebra
1

Output:
Afcsb
```

Uppercase letters wrap the same way, staying uppercase: `Z` shifts to `A`.

### Hints

- Use `ord()` to get a character's ASCII code and `chr()` to convert back.
- For a lowercase letter: `chr((ord(ch) - ord('a') + shift) % 26 + ord('a'))`.
- Handle uppercase letters separately with `ord('A')`.
- Use `.isalpha()` to check if a character is a letter.
