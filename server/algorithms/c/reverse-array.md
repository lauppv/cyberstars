# Easy · Reverse an Array

Read an integer **N**, then read **N** integers. Print them in **reverse** order, separated by spaces.

This exercise practices reading into a C array and iterating backwards.

### Input

- First line: an integer `N` (1 ≤ N ≤ 100)
- Second line: `N` integers separated by spaces

### Output

The `N` integers in reverse order, space-separated, on one line.

### Examples

```
Input:
5
1 2 3 4 5
Output: 5 4 3 2 1
```

```
Input:
3
10 20 30
Output: 30 20 10
```

### Hints

- Declare an array of size 100 (or use `N` with a VLA).
- Use `scanf` in a loop to read the values.
- Loop from `N-1` down to `0` to print in reverse.
