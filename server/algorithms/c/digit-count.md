# Easy · Count Digits

Read a single integer and print how many **digits** it has.

This exercise practices using a `while` loop and integer division.

### Input

- A single integer `N` (0 ≤ N ≤ 1 000 000 000)

### Output

A single integer: the number of digits in `N`.

### Examples

```
Input:
12345
Output: 5
```

```
Input:
0
Output: 1
```

### Hints

- Special case: if the number is `0`, the answer is `1`.
- Otherwise, keep dividing by `10` in a loop and count how many times you can do it before the number becomes `0`.
- Use `n = n / 10` (or `n /= 10`) to remove the last digit each iteration.
