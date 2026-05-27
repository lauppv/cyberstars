# Easy · Bubble Sort

Implement the **bubble sort** algorithm. Read an array of integers and sort them in ascending order using bubble sort, then print the sorted array.

Bubble sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

### Input

- Line 1: integer N — the number of elements
- Line 2: N space-separated integers

### Output

- The sorted integers on a single line, separated by spaces.

### Examples

```
Input:
5
5 3 8 1 2

Output:
1 2 3 5 8
```

```
Input:
3
3 2 1

Output:
1 2 3
```

### Hints

- Use two nested loops: the outer loop runs N-1 times, the inner loop compares adjacent elements.
- If `arr[j] > arr[j+1]`, swap them.
- After each pass of the outer loop, the largest unsorted element "bubbles up" to its correct position.
- You can optimize by stopping early if no swaps occur in a pass — the array is already sorted.
- Use `System.out.print` with spaces between elements (no trailing space).
