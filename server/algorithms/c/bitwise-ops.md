# Hard · Bitwise Power of Two

Read an integer **N**, then read **N** positive integers. For each number, print `"YES"` if it is a **power of 2**, or `"NO"` otherwise. You must use **bitwise operators** to check — no loops counting divisions.

A number `x` is a power of 2 if and only if `x > 0` and `(x & (x - 1)) == 0`.

### Input
- First line: an integer `N` (1 ≤ N ≤ 100)
- Next `N` lines: one positive integer each

### Output
`N` lines, each `YES` or `NO`.

### Examples

```
Input:
4
1
2
3
4
Output:
YES
YES
NO
YES
```

```
Input:
3
16
15
1024
Output:
YES
NO
YES
```

### Hints
- The bitwise trick: `(n & (n - 1)) == 0` is true only for powers of 2 (and zero, but input is positive).
- `&` is the bitwise AND operator in C.
- Powers of 2 in binary have exactly one bit set: `1, 10, 100, 1000, ...`