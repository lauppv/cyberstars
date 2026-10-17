Read an integer **N**, then read **N** integers. Sort them using the **insertion sort** algorithm and print the sorted result.

Insertion sort works by building a sorted portion of the array one element at a time. For each new element, shift larger elements to the right and insert it into its correct position. It runs in O(N²) time but is efficient for small or nearly-sorted arrays.

### Input

- First line: an integer `N` (1 <= N <= 3·10^4)
- The next `N` lines: one integer per line (-10^9 <= x <= 10^9)

### Output

The `N` integers sorted in ascending order, space-separated, on one line.

### Examples

```
Input:
5
12
11
13
5
6
Output: 5 6 11 12 13
```

```visual
{
  "type": "array",
  "values": [12, 11, 13, 5, 6],
  "caption": "The front of the array is sorted; at first it is just 12. Each step takes the next number and shifts every bigger number in front of it one place right, until the one on its left is smaller or nothing is left. The numbers not taken yet are faded.",
  "steps": [
    {"title": "Step 1", "range": [0, 1], "caption": "Take 11. In front of it, 12 is sorted on its own"},
    {"compare": [0, 1], "ask": "Is 12 > 11?", "swap": true, "caption": "Yes, so 12 shifts right and 11 moves left → [11, 12, 13, 5, 6]. Nothing is left of 11"},
    {"title": "Step 2", "range": [0, 2], "caption": "Take 13. In front of it, [11, 12] is sorted"},
    {"compare": [1, 2], "ask": "Is 12 > 13?", "caption": "No, so 13 stays. [11, 12, 13] is sorted"},
    {"title": "Step 3", "range": [0, 3], "caption": "Take 5"},
    {"compare": [2, 3], "ask": "Is 13 > 5?", "swap": true, "caption": "Yes, so 13 shifts right and 5 moves left → [11, 12, 5, 13, 6]"},
    {"compare": [1, 2], "ask": "Is 12 > 5?", "swap": true, "caption": "Yes, so 12 shifts right and 5 moves left → [11, 5, 12, 13, 6]"},
    {"compare": [0, 1], "ask": "Is 11 > 5?", "swap": true, "caption": "Yes, so 11 shifts right and 5 moves left → [5, 11, 12, 13, 6]. Nothing is left of 5"},
    {"title": "Step 4", "range": [0, 4], "caption": "Take 6, the last number"},
    {"compare": [3, 4], "ask": "Is 13 > 6?", "swap": true, "caption": "Yes, so 13 shifts right and 6 moves left → [5, 11, 12, 6, 13]"},
    {"compare": [2, 3], "ask": "Is 12 > 6?", "swap": true, "caption": "Yes, so 12 shifts right and 6 moves left → [5, 11, 6, 12, 13]"},
    {"compare": [1, 2], "ask": "Is 11 > 6?", "swap": true, "caption": "Yes, so 11 shifts right and 6 moves left → [5, 6, 11, 12, 13]"},
    {"compare": [0, 1], "ask": "Is 5 > 6?", "caption": "No, so 6 stays"},
    {"done": [0, 1, 2, 3, 4], "caption": "Every number is taken and the array is sorted: 5 6 11 12 13"}
  ]
}
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
9
Output: 9
```

```
Input:
4
1
1
2
2
Output: 1 1 2 2
```

An already-sorted array (with duplicates) needs no shifting at all.
