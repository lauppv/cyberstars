A crate of fruit is a grid where `o` is a fresh fruit, `x` a rotten one and `.` an empty spot. Every minute, each fresh fruit next to a rotten one rots too. Print how many minutes pass until no fresh fruit is left: `0` if there is none from the start, `-1` if some fruit never rots.

### How a grid is written

The first line has the number of rows and the number of columns. Then come the rows, from top to bottom, each on its own line with no spaces. Rows and columns are numbered from `0`. Two cells are next to each other when they share a side: up, down, left or right, never diagonally.

The hidden part of the program already reads the crate into `grid`, where `grid[r][c]` is the cell in row `r`, column `c`, then prints what `minutes_to_rot` returns. You write `minutes_to_rot`.

### Input

- Line 1: the number of rows and the number of columns, each between 1 and 25.
- The next lines: the crate, written with `o`, `x` and `.`.

### Output

The minutes until no fresh fruit is left, or `-1`.

### Examples

```
Input:
3 4
xoo.
.oo.
..ox

Output:
2
```

In minute 1 the fruit right of the top `x` and the one left of the bottom `x` rot. In minute 2 the other three do.

```
Input:
1 4
xo.o

Output:
-1
```

An empty spot keeps the last fruit away from the others, so it stays fresh.

```
Input:
2 2
..
.x

Output:
0
```
