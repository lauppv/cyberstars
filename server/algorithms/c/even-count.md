# Easy · Count Even Numbers

Read an integer **N**, then read **N** integers. Print how many of them are **even**.

This exercise practices using the modulo operator (`%`) to check divisibility.

### Input

- First line: an integer `N` (1 ≤ N ≤ 100)
- Second line: `N` integers separated by spaces

### Output

A single integer: the count of even numbers.

### Examples

```
Input:
5
1 2 3 4 5
Output: 2
```

```
Input:
4
2 4 6 8
Output: 4
```

### Hints

- A number is even if `x % 2 == 0`.
- Keep a counter variable, starting at `0`. Increment it each time you read an even number.
- You can check each number as you read it with `scanf` — no array needed.
