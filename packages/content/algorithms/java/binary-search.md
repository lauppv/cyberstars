Implement **binary search** on a sorted array of integers. Given a sorted array and a target value, find the index of the target. If the target is not in the array, print `-1`.

Use the classic binary search algorithm: maintain two pointers `low` and `high`, check the middle element, and narrow the search range by half each step.

### Input

- Line 1: integer N, the number of elements (1 <= N <= 2·10^4)
- The next N lines: one integer per line, in strictly ascending order (no duplicates), each between -10^6 and 10^6
- The next line: integer T, the target value to search for (-10^6 <= T <= 10^6)

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

```visual
{
  "type": "array",
  "values": [2, 4, 6, 8],
  "caption": "The array is sorted. low and high mark the part still searched, and mid is its middle. When the middle number isn't 5, the half where 5 can't be fades, and we search the other half.",
  "markers": ["low = {i}", "mid = {i}", "high = {i}"],
  "steps": [
    {"title": "Step 1", "at": [0, 1, 3], "compare": [1], "ask": "mid = (0 + 3) / 2 = 1, and the number there is 4. Is 4 < 5?", "caption": "Yes, so 5 can only be to the right of mid: low = mid + 1 = 2", "move": [2, null, 3], "range": [2, 3]},
    {"title": "Step 2", "at": [2, 2, 3], "compare": [2], "ask": "mid = (2 + 3) / 2 = 2, and the number there is 6. Is 6 < 5?", "caption": "No, 6 > 5, so 5 can only be to the left of mid: high = mid - 1 = 1", "move": [2, null, 1], "range": [2, 1]},
    {"title": "Step 3", "caption": "low = 2 has passed high = 1, so nothing is left to search. 5 isn't in the array: print -1"}
  ]
}
```

```
Input:
1
5
5

Output:
0
```

A single-element array works the same way: `low` and `high` both start at 0.

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

The target can be the very first or very last element. The search still
narrows down to it correctly.
