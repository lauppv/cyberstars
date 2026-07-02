# Even or Odd

Given an integer, determine whether it is **even** or **odd**.

### Input

A single line containing an integer `n`.

### Output

Print `Even` if the number is even, or `Odd` if the number is odd.

### Examples

```
Input:  4
Output: Even
```

```
Input:  7
Output: Odd
```

```
Input:  0
Output: Even
```

```
Input:  -3
Output: Odd
```

Negative numbers work the same way: `-3 % 2` is `-1` in most languages, but in
Python it's `1` — either way, it's not `0`, so `-3` is odd.

### Hints

- The modulo operator `%` gives you the remainder of a division.
- A number is even when `n % 2 == 0`.
- Remember to convert the input to an integer with `int()`.
