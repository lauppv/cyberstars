Grandpa Raj does the sudoku in the Sunday newspaper with a pencil and an eraser. His eyes get tired now, and twice he spent an hour on a grid that had a mistake from the first minute. You will write him a helper. He types in the grid as it is, and the program tells him if there is a mistake, fills in the cells it is sure about, and solves the rest by trying digits and taking them back when they don't work.

A sudoku is a grid of 9 by 9 cells, made of nine boxes of 3 by 3. When it is solved, every row, every column and every box has each digit from 1 to 9 exactly once.

**The input** is the grid: 9 lines of 9 characters. A digit is a filled cell and a `.` is an empty one:

```text
53..7....
6..195...
.98....6.
8...6...3
4..8.3..1
7...2...6
.6....28.
...419..5
....8..79
```

**The output** for this input, when the program is finished:

```text
5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6
------+-------+------
. 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9

Empty cells: 51
Sure cells: 51
Guesses: 0

5 3 4 | 6 7 8 | 9 1 2
6 7 2 | 1 9 5 | 3 4 8
1 9 8 | 3 4 2 | 5 6 7
------+-------+------
8 5 9 | 7 6 1 | 4 2 3
4 2 6 | 8 5 3 | 7 9 1
7 1 3 | 9 2 4 | 8 5 6
------+-------+------
9 6 1 | 5 3 7 | 2 8 4
2 8 7 | 4 1 9 | 6 3 5
3 4 5 | 2 8 6 | 1 7 9
```

Some words you will meet:

| Word         | What it means                                                                                |
| ------------ | -------------------------------------------------------------------------------------------- |
| box          | one of the nine squares of 3 by 3 cells                                                      |
| candidate    | a digit that could still go in an empty cell: it is not yet in the cell's row, column or box |
| sure cell    | an empty cell with only one candidate                                                        |
| backtracking | trying a digit, going on, and taking it back if it leads nowhere                             |

**To try your program**, press Run, click in the output box and paste the grid. The program knows it reads 9 lines, so it answers as soon as the last line is in.

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other grids, and some of them can't be solved. Passing them finishes the project.

## Read and show the grid

Read the 9 lines. Keep the grid as a list of 9 rows, where each row is a list of 9 numbers, and `0` is an empty cell.

Print the grid like in the newspaper: the digits with spaces between them, a `|` between the boxes, and a line between the rows of boxes. An empty cell shows as `.`:

```text
5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
8 . . | . 6 . | . . 3
```

Write this as a function, because you will print the solved grid with it too. Then print an empty line.

## Find the mistakes

A digit can be only once in each row, each column and each box. Rows are numbered 1 to 9 from the top, columns 1 to 9 from the left, and boxes 1 to 9 as you read: box 1 is top left, box 3 top right, box 9 bottom right.

Check every row first, then every column, then every box. In each one, check the digits from 1 to 9. A digit that is there more than once is a mistake. Here, the third row has two 8s:

```text
Mistakes:
  Row 3 has 2 8s
```

A grid with mistakes can't be solved, so the program stops after the list.

You can make a list of the 27 groups (9 rows, 9 columns, 9 boxes), each one a list of its 9 cells as (row, column) pairs. Then one loop checks all of them.

## What could go here

When the grid has no mistakes, print how many cells are empty:

```text
Empty cells: 51
```

Then write a function that gives the candidates of an empty cell: the digits from 1 to 9 that are not yet in its row, its column or its box. The box of the cell at row `r` and column `c` starts at row `r // 3 * 3` and column `c // 3 * 3` (counting from 0). Every next step uses this function.

## The sure cells

Go through the empty cells as you read, row by row, left to right. When a cell has only one candidate, write it in at once, so the next cells already see it. When you go through the whole grid and fill nothing, stop. Print how many cells you filled this way:

```text
Sure cells: 51
```

For an easy sudoku like the one above, this solves the whole grid.

## Try and take back

A hard sudoku may have no sure cells at all. Solve it by **backtracking**: a function that calls itself (a recursive function) and does this:

1. it finds the first empty cell as you read. If there is none, the grid is solved
2. it tries each candidate of that cell, the smallest first: it writes the digit in and calls itself
3. if the call solves the grid, it stops. If no candidate works, it empties the cell again and says it failed, so the call before it tries its next digit

Count every digit this search writes in. Print the count, then an empty line and the solved grid:

```text
Guesses: 0

5 3 4 | 6 7 8 | 9 1 2
```

The easy grid needs no guesses. A hard one can need many: `Guesses: 49558`. Do the search in exactly this order (after the sure cells, first empty cell, smallest candidate first), so your count is the same as the tests' count. Even fifty thousand guesses take Python about one second.

## No way out

A grid can have no mistake and still have no solution: at some point a cell has no candidate at all. Then the search fails at the very top. Print how many guesses it made, and say so:

```text
Guesses: 0
No solution
```

Now Grandpa checks his grid before he starts.
