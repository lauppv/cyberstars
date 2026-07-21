# Medium · Binary Search

Read a sorted array of **N** integers and a target value. Find the target using **binary search** and print its index (0-based), or **-1** if the target is not found.

Binary search works by repeatedly halving the search range. Compare the target with the middle element: if equal, you found it; if smaller, search the left half; if larger, search the right half. It runs in O(log N) time.

### Input

- First line: an integer `N` (1 ≤ N ≤ 1000)
- The next `N` lines: one integer per line, sorted in ascending order
- The next line: an integer `target` — the value to search for

### Output

A single integer: the 0-based index of the target in the array, or `-1` if not found.

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
Output: 2
```

```
Input:
4
10
20
30
40
25
Output: -1
```

```
Input:
1
5
5
Output: 0
```

A single-element array works the same way — `left` and `right` both start at 0.

```
Input:
1
5
3
Output: -1
```
