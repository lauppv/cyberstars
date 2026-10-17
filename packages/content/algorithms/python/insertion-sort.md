Read a list of numbers and sort them using the **insertion sort** algorithm. Insertion sort works by building a sorted portion of the list one element at a time: pick the next unsorted element and insert it into the correct position in the sorted portion.

### Input

- Line 1: an integer `n`, the count of numbers (1 <= n <= 3000).
- Line 2: `n` integers separated by spaces, each between -10^9 and 10^9.

### Output

The sorted numbers, separated by spaces.

### Examples

```
Input:
5
5 3 8 1 2

Output:
1 2 3 5 8
```

```visual
{
  "type": "array",
  "values": [5, 3, 8, 1, 2],
  "caption": "The front of the list is sorted; at first it is just 5. Each step takes the next number and moves it left past every bigger number, until the one on its left is smaller or nothing is left. The numbers not taken yet are faded.",
  "steps": [
    {"title": "Step 1", "range": [0, 1], "caption": "Take 3. In front of it, 5 is sorted on its own"},
    {"compare": [0, 1], "ask": "Is 5 > 3?", "swap": true, "caption": "Yes, so 5 moves right and 3 moves left → [3, 5, 8, 1, 2]. Nothing is left of 3"},
    {"title": "Step 2", "range": [0, 2], "caption": "Take 8. In front of it, [3, 5] is sorted"},
    {"compare": [1, 2], "ask": "Is 5 > 8?", "caption": "No, so 8 stays. [3, 5, 8] is sorted"},
    {"title": "Step 3", "range": [0, 3], "caption": "Take 1"},
    {"compare": [2, 3], "ask": "Is 8 > 1?", "swap": true, "caption": "Yes, so 8 moves right and 1 moves left → [3, 5, 1, 8, 2]"},
    {"compare": [1, 2], "ask": "Is 5 > 1?", "swap": true, "caption": "Yes, so 5 moves right and 1 moves left → [3, 1, 5, 8, 2]"},
    {"compare": [0, 1], "ask": "Is 3 > 1?", "swap": true, "caption": "Yes, so 3 moves right and 1 moves left → [1, 3, 5, 8, 2]. Nothing is left of 1"},
    {"title": "Step 4", "range": [0, 4], "caption": "Take 2, the last number"},
    {"compare": [3, 4], "ask": "Is 8 > 2?", "swap": true, "caption": "Yes, so 8 moves right and 2 moves left → [1, 3, 5, 2, 8]"},
    {"compare": [2, 3], "ask": "Is 5 > 2?", "swap": true, "caption": "Yes, so 5 moves right and 2 moves left → [1, 3, 2, 5, 8]"},
    {"compare": [1, 2], "ask": "Is 3 > 2?", "swap": true, "caption": "Yes, so 3 moves right and 2 moves left → [1, 2, 3, 5, 8]"},
    {"compare": [0, 1], "ask": "Is 1 > 2?", "caption": "No, so 2 stays"},
    {"done": [0, 1, 2, 3, 4], "caption": "Every number is taken and the list is sorted: 1 2 3 5 8"}
  ]
}
```

```
Input:
4
4 3 2 1

Output:
1 2 3 4
```

```
Input:
1
9

Output:
9
```

A single-element list is already sorted.

```
Input:
4
3 1 3 1

Output:
1 1 3 3
```

Duplicate values are kept: the sort just needs to place equal values next to
each other.
