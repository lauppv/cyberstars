A maze is a grid where `#` is a wall and `.` a free cell. You start on the cell marked `A` and want to reach the cell marked `B`, and each step takes you to a cell next to yours that isn't a wall. Print the fewest steps that get you from `A` to `B`, or `-1` if no way leads there.

### How a grid is written

The first line has the number of rows and the number of columns. Then come the rows, from top to bottom, each on its own line with no spaces. Rows and columns are numbered from `0`. Two cells are next to each other when they share a side: up, down, left or right, never diagonally.

The starter code already reads the maze into `grid`, where `grid[r][c]` is the cell in row `r`, column `c`, then prints what `fewest_steps` returns. You write `fewest_steps`.

### Input

- Line 1: the number of rows and the number of columns, each between 1 and 25.
- The next lines: the maze, written with `#`, `.`, `A` and `B`. There is exactly one `A` and one `B`.

### Output

The fewest steps from `A` to `B`, or `-1`.

### Examples

```
Input:
5 7
A..#...
.#.#.#.
.#...#.
.####..
......B

Output:
10
```

Down the left side and along the bottom row takes 10 steps. The way across the top takes 14.

```
Input:
3 3
A#.
##.
..B

Output:
-1
```

Walls close `A` in.

```
Input:
1 2
BA

Output:
1
```
