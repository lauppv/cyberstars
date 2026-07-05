# Hard · Merge Sort

Read an integer **N**, then read **N** integers. Sort them using the **merge sort** algorithm and print the sorted result.

Merge sort is a divide-and-conquer algorithm: split the array in half, recursively sort each half, then merge the two sorted halves together. It runs in O(N log N) time.

### Input

- First line: an integer `N` (1 ≤ N ≤ 1000)
- The next `N` lines: one integer per line

### Output

The `N` integers sorted in ascending order, space-separated, on one line.

### Examples

```
Input:
5
38
27
43
3
9
Output: 3 9 27 38 43
```

```
Input:
4
4
3
2
1
Output: 1 2 3 4
```

```
Input:
1
42
Output: 42
```

The base case: a single-element array is already sorted.

```
Input:
5
-1
-5
0
-5
3
Output: -5 -5 -1 0 3
```

Negative numbers and duplicates sort the same way as any other integers.
