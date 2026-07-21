# Medium · Bubble Sort

Implement the **bubble sort** algorithm. Read an array of integers and sort them in ascending order using bubble sort, then print the sorted array.

Bubble sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

### Input

- Line 1: integer N — the number of elements
- The next N lines: one integer per line

### Output

- The sorted integers on a single line, separated by spaces.

### Examples

```
Input:
5
5
3
8
1
2

Output:
1 2 3 5 8
```

```
Input:
3
3
2
1

Output:
1 2 3
```

```
Input:
1
7

Output:
7
```

A single-element array is already sorted — no swaps needed.

```
Input:
4
2
2
1
1

Output:
1 1 2 2
```

Duplicate values are handled the same way as any other comparison — only
swap when strictly greater.
