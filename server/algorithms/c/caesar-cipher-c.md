# Medium · Caesar Cipher

Encrypt a string using the **Caesar cipher**. Each letter is shifted forward in the alphabet by a given amount. Uppercase letters stay uppercase, lowercase letters stay lowercase, and non-letter characters are left unchanged.

For example, with a shift of 3: `A` becomes `D`, `z` becomes `c`, and `5` stays `5`.

### Input
- First line: a string (may contain spaces, up to 200 characters)
- Second line: an integer `shift` (1 ≤ shift ≤ 25)

### Output
The encrypted string on one line.

### Examples

```
Input:
Hello, World!
3
Output: Khoor, Zruog!
```

```
Input:
xyz
2
Output: zab
```

### Hints
- Use `fgets` to read the string (it handles spaces). Remove the trailing newline if present.
- For a lowercase letter `c`: `encrypted = (c - 'a' + shift) % 26 + 'a'`.
- For an uppercase letter `c`: `encrypted = (c - 'A' + shift) % 26 + 'A'`.
- Use `strlen` from `<string.h>` to iterate over the string.
