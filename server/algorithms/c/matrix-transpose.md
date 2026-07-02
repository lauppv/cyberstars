# Medium · Matrix Transpose

Read an integer **N**, then read an **N×N** matrix of integers. Print its **transpose** (rows become columns).

This exercise practices working with 2D arrays in C and nested loops.

### Input

- First line: an integer `N` (1 ≤ N ≤ 20)
- Next `N` lines: each with `N` space-separated integers

### Output

`N` lines, each with `N` space-separated integers, representing the transposed matrix.

### Examples

```
Input:
2
1 2
3 4
Output:
1 3
2 4
```

```
Input:
3
1 2 3
4 5 6
7 8 9
Output:
1 4 7
2 5 8
3 6 9
```

```
Input:
1
5
Output:
5
```

A 1x1 matrix is its own transpose.
