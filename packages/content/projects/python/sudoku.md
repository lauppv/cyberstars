Grandpa Raj does the sudoku in the Sunday paper with a pencil and an eraser. Lately his eyes are tired, and twice he spent an hour on a grid that had a mistake from the very first minute. You'll write him a helper: he types in the grid as it stands, and the program tells him if anything clashes, fills in the cells that are sure, and, if he asks it to, solves the rest by trying digits and taking them back when they lead nowhere.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests give your program grids it has never seen, some of them impossible. Passing them finishes the project.

## Read and show the grid

The input is the grid, 9 lines of 9 characters, a digit for a filled cell and a `.` for an empty one:

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

Keep it as a list of 9 rows, each a list of 9 numbers, with `0` for an empty cell. Print it the way the paper does, digits separated by spaces, a `|` between the 3 by 3 boxes and a line between their rows:

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
```

Write it as a function: you'll print the solved grid with it too. Then print an empty line.

## Find the mistakes

A digit may appear only once in each row, each column and each 3 by 3 box. Rows and columns are numbered 1 to 9 from the top and from the left, and the boxes 1 to 9 in reading order (box 1 top left, box 3 top right, box 9 bottom right).

Check them all: first every row, then every column, then every box, and in each, the digits from 1 to 9. When a digit appears more than once, that's a mistake:

```text
Mistakes:
  Row 4 has 2 2s
  Row 9 has 2 9s
  Column 6 has 2 3s
  Box 1 has 3 1s
```

A grid with mistakes can't be solved, so the program stops there. Writing a list of the 27 groups, each a list of its 9 cells as (row, column), lets one loop check all three kinds.

## What could go here

For a grid without mistakes, print how many cells are empty: `Empty cells: 51`.

Then write a function that gives the candidates of an empty cell: the digits from 1 to 9 not yet used in its row, its column or its box. For the top left box, the box of a cell starts at row `r // 3 * 3` and column `c // 3 * 3`. Every step from here uses this function.

## The sure cells

A cell with a single candidate is sure. Go through the empty cells in reading order (row by row, left to right) and fill every sure cell at once, so the cells after it in the same pass already see it. When a whole pass fills nothing, stop. Print how many cells were filled this way:

```text
Sure cells: 51
```

That's the whole of an easy puzzle: Grandpa's Sunday grid needs nothing more.

## Try and take back

A hard puzzle has no sure cells at all. For those, solve by **backtracking**, a recursive function that:

1. finds the first empty cell in reading order; if there is none, the grid is solved
2. tries each of its candidates, smallest first: writes it in and calls itself on the grid
3. if a call solves the grid, stops; if every candidate fails, empties the cell again and reports failure, so the call before it tries its next digit

Count every digit the search writes in, then print the count and, after an empty line, the solved grid:

```text
Guesses: 49558
```

Following exactly this order (first empty cell, smallest candidate first, after the sure cells) makes the count the same as the tests'. Even fifty thousand guesses take Python about a second.

## No way out

A grid can have no mistake and still be impossible: somewhere, a cell will end up with no candidate at all. Then the search fails at the very top. Print the guesses it made and say so:

```text
Guesses: 0
No solution
```

Grandpa now checks his grid before he starts.
