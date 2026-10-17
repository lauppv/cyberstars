Implement the **bubble sort** algorithm. Read an array of integers and sort them in ascending order using bubble sort, then print the sorted array.

Bubble sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

### Input

- Line 1: integer N, the number of elements (1 <= N <= 10^4)
- The next N lines: one integer per line (any `int` value)

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

```visual
{
  "type": "array",
  "values": [5, 3, 8, 1, 2],
  "caption": "We start at position 0 (j = 0) and compare that number with its right neighbour (j + 1). If the left one is bigger, they swap. Then j moves one step right. Each pass pushes the biggest number to the end.",
  "pointers": ["j = {i}", "j + 1"],
  "steps": [
    {"title": "Pass 1", "compare": [0, 1], "ask": "Is 5 > 3?", "swap": true, "caption": "Yes, so they swap"},
    {"compare": [1, 2], "ask": "Is 5 > 8?", "caption": "No, so they stay"},
    {"compare": [2, 3], "ask": "Is 8 > 1?", "swap": true, "caption": "Yes, so they swap"},
    {"compare": [3, 4], "ask": "Is 8 > 2?", "swap": true, "caption": "Yes, so they swap"},
    {"sorted": 4, "caption": "8 is at the end, in its place"},
    {"title": "Pass 2", "compare": [0, 1], "ask": "Is 3 > 5?", "caption": "No, so they stay"},
    {"compare": [1, 2], "ask": "Is 5 > 1?", "swap": true, "caption": "Yes, so they swap"},
    {"compare": [2, 3], "ask": "Is 5 > 2?", "swap": true, "caption": "Yes, so they swap"},
    {"sorted": 3, "caption": "5 is in its place too"},
    {"title": "Pass 3", "compare": [0, 1], "ask": "Is 3 > 1?", "swap": true, "caption": "Yes, so they swap"},
    {"compare": [1, 2], "ask": "Is 3 > 2?", "swap": true, "caption": "Yes, so they swap"},
    {"sorted": 0, "caption": "Done! The array is sorted"}
  ]
}
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

A single-element array is already sorted, no swaps needed.

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

Duplicate values are handled the same way as any other comparison: only
swap when strictly greater.
