Read an NxN matrix of integers and print its elements in **spiral order**: start from the top-left corner, move right along the top row, then down the right column, then left along the bottom row, then up the left column, and repeat inward.

### Input

- Line 1: an integer `n` — the size of the matrix (1 <= n <= 10).
- Next `n` lines: each containing `n` space-separated integers.

### Output

All matrix elements in spiral order, separated by spaces.

### Examples

```
Input:
3
1 2 3
4 5 6
7 8 9

Output:
1 2 3 6 9 8 7 4 5
```

```
Input:
4
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16

Output:
1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10
```

```
Input:
1
5

Output:
5
```

A 1x1 matrix has nowhere to spiral — the single element is the whole answer.

```
Input:
2
1 2
3 4

Output:
1 2 4 3
```
