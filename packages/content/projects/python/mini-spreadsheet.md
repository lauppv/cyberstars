Pablo keeps the money for his class, and this spring the class goes on a trip. He has to count the bus, the museum tickets, lunch, the total, and what each kid pays. And every time a kid can't come, all the numbers change. A spreadsheet, a program like Excel, would change them by itself, but the school's computers don't have one. You will write a small one.

A spreadsheet is a table of cells. A cell can hold a number, a text, or a formula: a calculation that can use other cells, like `B5 / C2`. The table always shows the newest results.

**The input** is commands, one on each line:

```text
A1 = "Item"
B1 = "Cost"
C1 = "Kids"
A2 = "Bus"
B2 = 900
C2 = 30
A3 = "Museum"
B3 = 15 * C2
A4 = "Lunch"
B4 = C2 * (12.5 + 2)
A5 = "Total"
B5 = SUM(B2:B4)
A6 = "Each"
B6 = B5 / C2
print
show B6
C2 = 0
show B6
C2 = 30
D1 = D2 + 1
D2 = D1 * 2
E1 = (2 + 3
E2 = A1 + 1
E3 = MAX(B2:B4) - MIN(B2:B4)
print
show Z9
hello
B9 =
```

**The output** for this input, when the program is finished:

```text
        A         B         C
  1 Item      Cost      Kids
  2 Bus              900        30
  3 Museum           450
  4 Lunch            435
  5 Total           1785
  6 Each           59.50
B6 = B5 / C2 -> 59.50
B6 = B5 / C2 -> #DIV/0!
        A         B         C         D         E
  1 Item      Cost      Kids         #CYCLE!   #ERROR!
  2 Bus              900        30   #CYCLE!   #VALUE!
  3 Museum           450                           465
  4 Lunch            435
  5 Total           1785
  6 Each           59.50
Z9 is empty
I don't understand: hello
```

The commands:

| Command    | What it does                                                              |
| ---------- | ------------------------------------------------------------------------- |
| `B2 = 900` | puts something in a cell: a number, a text in double quotes, or a formula |
| `B2 =`     | empties the cell                                                          |
| `print`    | shows the whole table                                                     |
| `show B6`  | shows one cell's formula and its result                                   |

A cell's name is a column letter and a row number: `A1`, `B12`.

**To try your program**, press Run and type the commands in the output box, or paste them all at once. The program answers `print` and `show` at once. When you have no more lines, press **End input** under the output box (or Ctrl + D), and the program ends.

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests type other tables into your program. Passing them finishes the project.

## Cells and the table

Read the commands until the input ends: when there are no more lines, `input()` stops with an error called `EOFError`.

`B2 = 900` puts something in a cell and replaces what was there. `B2 =` with nothing after it empties the cell. Keep each cell's text in a dictionary, exactly as it was typed after the `=`. Don't keep results: work them out only when you show them.

For now, cells hold numbers and texts. A text is written between double quotes (`A1 = "Item"`) and shows without them.

`print` shows the table:

```text
        A         B         C
  1 Item      Cost      Kids
  2 Bus              900        30
  3 Museum           450
```

- the first line has the column letters, each in the middle of 10 characters, after four spaces
- then one line for each row, from 1 to the last row used: the row number right-aligned in 3 characters, a space, then each column from `A` to the last column used, 10 characters wide
- numbers are right-aligned and texts left-aligned. An empty cell is 10 spaces
- take the spaces off the end of each line
- a whole number shows with no decimals (`900`), any other number with two (`59.50`)

Before any cell has something in it, `print` shows `(empty)`.

## Arithmetic

A cell can hold a formula: `B4 = 30 * (12.5 + 2)`. Work it out like in maths: brackets first, then `*` and `/`, then `+` and `-`, and from left to right when they are equal. A `-` in front of a number or a bracket makes it negative: `-(2 + 3)` is `-5`.

Calculators do this with three small functions that call each other. A function that calls itself, directly or through another, is **recursive**:

- `expr` reads a `term`, then, as long as a `+` or `-` comes next, another `term`
- `term` reads a `factor`, then, as long as a `*` or `/` comes next, another `factor`
- `factor` reads a number, or a `-` and then a `factor`, or a `(`, an `expr` and a `)`

First cut the formula into tokens: numbers, cell names, and each of `+ - * / ( ) :` on its own. Then let the three functions go through the tokens. Because `factor` calls `expr` for a bracket, brackets inside brackets work by themselves.

Try it: `A1 = -(2 - 10) / 2` and then `show A1` should give `A1 = -(2 - 10) / 2 -> 4`.

## Cells that use cells

A formula can name other cells: `B6 = B5 / C2`. To work out `B6`, your program works out `B5` and `C2` first, which may use other cells, and so on: recursion again. An empty cell counts as 0.

`show B6` prints a cell's formula and its result:

```text
B6 = B5 / C2 -> 59.50
```

For an empty cell, print `Z9 is empty`. Change `C2`, then `show B6` again: the new result is there, because nothing is kept and everything is worked out when it is needed.

## Ranges

A range is a rectangle of cells, from one corner to the other: `B2:B4` is `B2`, `B3` and `B4`. Three functions use ranges:

- `SUM(B2:B4)` adds up every cell of the range
- `MIN(B2:B4)` gives the smallest value
- `MAX(B2:B4)` gives the biggest value

The corners can come in any order (`B4:B2` is the same range), and empty cells count as 0:

```text
B5 = SUM(B2:B4)
E3 = MAX(B2:B4) - MIN(B2:B4)
```

## When something is wrong

Sometimes a cell can't be worked out. Then it shows an error in place of a number:

| Error     | When                                                                       |
| --------- | -------------------------------------------------------------------------- |
| `#DIV/0!` | the formula divides by 0                                                   |
| `#VALUE!` | the formula does maths with a text cell                                    |
| `#ERROR!` | the formula can't be read: `(2 + 3`, `2 +`, or a character it doesn't know |

A cell that uses a cell with an error shows the same error.

Make your own exception class, raise it where something is wrong, and catch it once, around the whole formula of the cell you show. The error then goes up through any number of cells by itself.

## Going round in circles

`D1 = D2 + 1` and `D2 = D1 * 2` need each other, so working out either one would never end. This is a circle.

Keep a set of the cells you are working out right now. When your program needs a cell that is already in the set, the formulas go round in a circle. Then every cell of the circle, and every cell that uses one of them, shows `#CYCLE!`:

```text
        A         B         C         D         E
  1 Item      Cost      Kids         #CYCLE!   #ERROR!
  2 Bus              900        30   #CYCLE!   #VALUE!
```

Two last rules:

- a line that is not a command and doesn't put something in a cell prints `I don't understand: hello`
- a name before the `=` that is not a cell prints `Not a cell: total`

Pablo worked out the whole trip in ten minutes.
