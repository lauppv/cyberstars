# Easy · Binary Search

Implement **binary search** on a sorted array of integers. Given a sorted array and a target value, find the index of the target. If the target is not in the array, print `-1`.

Use the classic binary search algorithm: maintain two pointers `low` and `high`, check the middle element, and narrow the search range by half each step.

### Input

- Line 1: integer N — the number of elements
- Line 2: N space-separated integers in ascending order
- Line 3: integer T — the target value to search for

### Output

- The 0-based index of the target in the array, or `-1` if not found.

### Examples

```
Input:
5
1 3 5 7 9
5

Output:
2
```

```
Input:
4
2 4 6 8
5

Output:
-1
```

### Hints

- Start with `low = 0` and `high = N - 1`.
- Compute `mid = (low + high) / 2`.
- If `arr[mid] == target`, you found it — print `mid`.
- If `arr[mid] < target`, search the right half: `low = mid + 1`.
- If `arr[mid] > target`, search the left half: `high = mid - 1`.
- If `low > high`, the target is not in the array.
