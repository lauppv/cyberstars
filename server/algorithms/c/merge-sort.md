# Hard · Merge Sort

Read an integer **N**, then read **N** integers. Sort them using the **merge sort** algorithm and print the sorted result.

Merge sort is a divide-and-conquer algorithm: split the array in half, recursively sort each half, then merge the two sorted halves together. It runs in O(N log N) time.

### Input
- First line: an integer `N` (1 ≤ N ≤ 1000)
- Second line: `N` integers separated by spaces

### Output
The `N` integers sorted in ascending order, space-separated, on one line.

### Examples

```
Input:
5
38 27 43 3 9
Output: 3 9 27 38 43
```

```
Input:
4
4 3 2 1
Output: 1 2 3 4
```

### Hints
- Write a `merge` function that merges two sorted subarrays into one.
- Write a `mergeSort` function that recursively splits and merges.
- You'll need a temporary array for merging — you can allocate it with `malloc` or use a global/local array.
- Base case: an array of size 0 or 1 is already sorted.