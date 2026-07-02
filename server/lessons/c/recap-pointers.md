Combine **nested loops**, **pointers**, and **pass by reference**

---

## Mission: The Memory Tape Diagnostic

A 3x3 block of memory has just been read off a tape. Before you archive it, you need a quick diagnostic: the sum of all cells, the lowest value, and the highest spike. One function must compute all three results at once, through pointers.

1. Read 9 integers from input, 3 per line across 3 lines, into an array **int matrix[3][3]**
2. Write **void matrix_stats(int matrix[3][3], int \*sum, int \*min, int \*max)** using nested loops to scan the matrix
3. Set the sum, min, and max values through pointers
4. Call the function from **main** and print the results, matching the format in the example exactly

**Example**

Input

```text
5 12 3
8 1 15
7 9 4
```

Output

```text
Sum: 64
Min: 1
Max: 15
```

**Example**

Input

```text
2 4 6
8 10 12
14 16 18
```

Output

```text
Sum: 90
Min: 2
Max: 18
```

The function "returns" three values at once using pointers — the pass-by-reference pattern
