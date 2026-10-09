Given an integer, determine whether it is **even** or **odd**.

### Input

A single line containing an integer `n` (can be negative) with at most 19 digits, not counting the minus sign.

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
Python it's `1`. Either way, it's not `0`, so `-3` is odd.
