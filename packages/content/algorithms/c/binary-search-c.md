Read a sorted array of **N** integers and a target value. Find the target using **binary search** and print its index (0-based), or **-1** if the target is not found.

Binary search works by repeatedly halving the search range. Compare the target with the middle element: if equal, you found it; if smaller, search the left half; if larger, search the right half. It runs in O(log N) time.

### Input

- First line: an integer `N` (1 <= N <= 2·10^4)
- The next `N` lines: one integer per line (each between -10^6 and 10^6), sorted in ascending order
- The next line: an integer `target` (between -10^6 and 10^6), the value to search for

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

```visual
{
  "type": "array",
  "values": [10, 20, 30, 40],
  "caption": "The array is sorted. left and right mark the part still searched, and mid is its middle. When the middle number isn't 25, the half where 25 can't be fades, and we search the other half.",
  "markers": ["left = {i}", "mid = {i}", "right = {i}"],
  "steps": [
    {"title": "Step 1", "at": [0, 1, 3], "compare": [1], "ask": "mid = (0 + 3) / 2 = 1, and the number there is 20. Is 20 < 25?", "caption": "Yes, so 25 can only be to the right of mid: left = mid + 1 = 2", "move": [2, null, 3], "range": [2, 3]},
    {"title": "Step 2", "at": [2, 2, 3], "compare": [2], "ask": "mid = (2 + 3) / 2 = 2, and the number there is 30. Is 30 < 25?", "caption": "No, 30 > 25, so 25 can only be to the left of mid: right = mid - 1 = 1", "move": [2, null, 1], "range": [2, 1]},
    {"title": "Step 3", "caption": "left = 2 has passed right = 1, so nothing is left to search. 25 isn't in the array: print -1"}
  ]
}
```

```
Input:
1
5
5
Output: 0
```

A single-element array works the same way: `left` and `right` both start at 0.

```
Input:
1
5
3
Output: -1
```
