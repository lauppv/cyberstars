Pablo is the class treasurer, and this spring the class goes on a trip. He has to work out the bus, the museum tickets, lunch, the total and what each kid pays, and every time someone drops out, everything changes. On a spreadsheet it would update by itself, but the school's computers have none. You'll write a small one: cells hold numbers, text or formulas that use other cells, and the table always shows the latest results.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests type sheets into your program that it has never seen. Passing them finishes the project.

The program reads commands until the input ends (`input()` raises `EOFError` then).

## Cells and the table

A cell is named by a column letter and a row number: `A1`, `B12`. A line like `B2 = 900` puts something in a cell, replacing what was there; `B2 =` with nothing after empties it. Keep each cell's text, exactly as typed after the `=`, in a dictionary: the results are worked out only when they're shown.

`print` shows the table: a header with the column letters, each centred in 10 characters, then a line per row from 1 to the last row used, the row number right-aligned in 3 and a space, then each column from `A` to the last one used, 10 characters wide:

```text
        A         B         C
  1 Item      Cost      Kids
  2 Bus              900        30
  3 Museum           450
```

Numbers are right-aligned, and text left-aligned; an empty cell is 10 spaces. Take the spaces off each line's end. A whole number shows without decimals, any other number with two (`59.50`). Before any cell is filled, `print` shows `(empty)`.

For now, cells hold numbers and text. Text is written between double quotes (`A1 = "Item"`) and shows without them.

## Arithmetic

A cell can hold a formula: `B4 = 30 * (12.5 + 2)`. Work it out with `*` and `/` before `+` and `-`, left to right otherwise, brackets first, and a `-` in front of a number or a bracket making it negative.

The way calculators do this is a small **recursive** reader, three functions that call each other:

- `expr` reads a `term`, then as long as a `+` or `-` follows, another `term`
- `term` reads a `factor`, then as long as a `*` or `/` follows, another `factor`
- `factor` reads a number, a `-` and a `factor`, or a `(`, an `expr` and a `)`

First cut the formula into tokens (numbers, names, and each of `+ - * / ( ) :` on its own), then let the three functions walk through them. Because `expr` sits inside `factor` through the brackets, any depth of brackets just works.

## Cells that use cells

A formula can name other cells: `B6 = B5 / C2`. A cell's value is its formula worked out, so reading a name means working out that cell's value, recursively. An empty cell counts as 0.

`show B6` prints a cell's formula and its value:

```text
B6 = B5 / C2 -> 59.50
```

An empty cell shows `Z9 is empty`. Change `C2`, `show B6` again, and the new result is there: nothing is stored, everything is worked out when asked.

## Ranges

`SUM(B2:B4)` adds up every cell of a rectangle, from one corner to the other; `MIN` and `MAX` give its smallest and largest value. The corners can be given in any order, and empty cells count as 0:

```text
B5 = SUM(B2:B4)
E3 = MAX(B2:B4) - MIN(B2:B4)
```

## When something's wrong

A cell can't always be worked out. Instead of a number, it shows an error:

- `#DIV/0!` when it divides by 0
- `#VALUE!` when it does arithmetic with a text cell
- `#ERROR!` when the formula can't be read (`(2 + 3`, `2 +`, an unknown character)

And a cell that uses a cell with an error shows the same error. Raising your own exception class in the reader, and catching it once around a cell's formula, carries the error up through any number of cells.

## Going round in circles

`D1 = D2 + 1` and `D2 = D1 * 2` need each other: working out either would never end. Keep a set of the cells being worked out right now; when a cell is asked for while it's already in the set, the formula goes round in a circle, and every cell of the circle, and every cell that uses one of them, shows `#CYCLE!`:

```text
             A         B         C         D         E
  1 Item      Cost      Kids         #CYCLE!   #ERROR!
  2 Bus              900        30   #CYCLE!   #VALUE!
```

A line that isn't a command or a cell prints `I don't understand: hello`, and a name that isn't a cell before the `=` prints `Not a cell: total`. Pablo worked out the trip in ten minutes.
