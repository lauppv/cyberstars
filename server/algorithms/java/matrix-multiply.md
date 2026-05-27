# Hard · Matrix Multiplication

Multiply two matrices **A** and **B** and print the resulting matrix **C**.

Matrix multiplication is defined as: `C[i][j] = sum of A[i][k] * B[k][j]` for all k. The number of columns in A must equal the number of rows in B.

### Input

- Line 1: two integers `R1 C1` — dimensions of matrix A
- Next R1 lines: C1 space-separated integers — rows of matrix A
- Next line: two integers `R2 C2` — dimensions of matrix B
- Next R2 lines: C2 space-separated integers — rows of matrix B

### Output

- R1 lines, each containing C2 space-separated integers — the product matrix C.

### Examples

```
Input:
2 3
1 2 3
4 5 6
3 2
7 8
9 10
11 12

Output:
58 64
139 154
```

```
Input:
2 2
1 2
3 4
2 2
5 6
7 8

Output:
19 22
43 50
```

### Hints

- The result matrix C has dimensions R1 x C2.
- Use three nested loops: `i` over rows of A, `j` over columns of B, `k` over the shared dimension.
- `C[i][j] += A[i][k] * B[k][j]` for each k from 0 to C1-1.
- Initialize the result matrix with zeros before computing.
- Print each row on its own line with values separated by spaces.
