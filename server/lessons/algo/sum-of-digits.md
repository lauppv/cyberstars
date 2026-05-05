# Sum of Digits

Given a non-negative integer `n`, print the **sum of its digits**.

### Input
A single line with an integer `n` (0 ≤ n ≤ 10⁹).

### Output
A single integer — the sum of the digits of `n`.

### Examples

```
Input:  1234
Output: 10
```

```
Input:  9
Output: 9
```

```
Input:  100
Output: 1
```

### Hints
- Read the input as a string first — then iterate over each character.
- Convert each character back to `int` and sum them up.
- Or, do it with math: keep doing `n % 10` and `n // 10` until `n` is 0.
