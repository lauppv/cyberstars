# Medium · Insertion Sort

Read an integer **N**, then read **N** integers. Sort them using the **insertion sort** algorithm and print the sorted result.

Insertion sort works by building a sorted portion of the array one element at a time. For each new element, shift larger elements to the right and insert it into its correct position. It runs in O(N²) time but is efficient for small or nearly-sorted arrays.

### Input

- First line: an integer `N` (1 ≤ N ≤ 1000)
- Second line: `N` integers separated by spaces

### Output

The `N` integers sorted in ascending order, space-separated, on one line.

### Examples

```
Input:
5
12 11 13 5 6
Output: 5 6 11 12 13
```

```
Input:
4
4 3 2 1
Output: 1 2 3 4
```

```
Input:
1
9
Output: 9
```

```
Input:
4
1 1 2 2
Output: 1 1 2 2
```

An already-sorted array (with duplicates) needs no shifting at all.

### Hints

- Start from the second element (index 1) and work forward.
- For each element, save it in a `key` variable, then shift all larger elements one position to the right.
- Insert the `key` at the position where the shifting stopped.
- The portion of the array before the current index is always sorted.
