A map is a grid where `#` is land and `.` is water. An **island** is a group of land cells you can walk between, stepping from a land cell only onto a land cell next to it. Print how many islands the map has.

### How a grid is written

The first line has the number of rows and the number of columns. Then come the rows, from top to bottom, each on its own line with no spaces. Rows and columns are numbered from `0`. Two cells are next to each other when they share a side: up, down, left or right, never diagonally.

The hidden part of the program already reads the map into `grid`, where `grid[r][c]` is the cell in row `r`, column `c`, then prints what `countIslands` returns. You write `countIslands`.

### Input

- Line 1: the number of rows and the number of columns, each between 1 and 25.
- The next lines: the map, written with `#` and `.`.

### Output

The number of islands.

### Examples

```
Input:
4 6
##..#.
#...##
..#...
.#.##.

Output:
5
```

The cells in row `2`, column `2` and in row `3`, column `1` touch only at a corner, so they are two islands.

```
Input:
3 3
###
#.#
###

Output:
1
```

A ring of land around a lake is still one island.

```
Input:
2 3
...
...

Output:
0
```
