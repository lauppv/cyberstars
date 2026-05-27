# Sum of Digits

Given an integer, print the **sum of its digits**.

### Input

A single line containing an integer `n` (can be negative).

### Output

The sum of the digits of `n`. If `n` is negative, ignore the minus sign.

### Examples

```
Input:  1234
Output: 10
```

```
Input:  -56
Output: 11
```

### Hints

- Convert the number to a string, then loop through each character.
- Use `abs()` to handle negative numbers, or just skip non-digit characters.
- `int(ch)` converts a digit character back to a number.
- You can also solve this with `%` and `//` in a `while` loop — try both approaches!
