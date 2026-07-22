Implement **binary search** on a sorted array of integers. Given a sorted array and a target value, find the index of the target. If the target is not in the array, print `-1`.

Use the classic binary search algorithm: maintain two pointers `low` and `high`, check the middle element, and narrow the search range by half each step.

### Input

- Line 1: integer N — the number of elements
- The next N lines: one integer per line, in ascending order
- The next line: integer T — the target value to search for

### Output

- The 0-based index of the target in the array, or `-1` if not found.

### Examples

```
Input:
5
1
3
5
7
9
5

Output:
2
```

```
Input:
4
2
4
6
8
5

Output:
-1
```

```
Input:
1
5
5

Output:
0
```

A single-element array works the same way — `low` and `high` both start at 0.

```
Input:
1
5
3

Output:
-1
```

```
Input:
6
1
2
3
4
5
6
1

Output:
0
```

The target can be the very first or very last element — the search still
narrows down to it correctly.
