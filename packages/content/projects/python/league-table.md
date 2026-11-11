Every Sunday four neighbourhood teams play football in the park, and Oliver, who organises the league, writes each result in a text file on his phone. At the end of the season everyone wants the final table, the kind newspapers print, with every column lined up. Oliver pastes the whole file into your program, and it prints the table.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests feed your program seasons it has never seen. Passing them finishes the project.

This program asks nothing: it reads the whole file and prints everything at once.

## Read until the file ends

The input is the season, one result per line, the home team first:

```text
Lions 2-1 Tigers
Bears 0-0 Wolves
Tigers 4-0 Bears
```

You don't know how many lines there are. `input()` raises an `EOFError` when the input runs out, so read in a `while True` loop and stop when you catch it:

```python
try:
    line = input()
except EOFError:
    break
```

Skip empty lines, keep the others, and print how many matches you read: `10 matches read` (`1 match read` for one).

## Lines that aren't results

Oliver types fast on a small screen. A line is a result only if it has three words, the two teams are different, and the score is two whole numbers joined by a `-`. Leave every other line out of the season, and after the count say which ones, with their line number in the file (empty lines count too):

```text
10 matches read
Line 9 skipped: Lions 2:1 Wolves
Line 13 skipped: Eagles 1-0
Line 14 skipped: Lions 1-1 Lions
```

`isdigit()` tells whether a piece of the score is a whole number.

## Every team's numbers

Go through the matches and keep, for every team: matches played, won, drawn, lost, goals scored and goals let in. A dictionary from team name to a small dictionary of numbers works well. A win is worth 3 points, a draw 1.

Also keep each team's results in order as a string of letters, `W`, `D` or `L`: the last step of the table needs it.

## Who's on top

Order the teams: most points first; on equal points, the better goal difference (scored minus let in); then more goals scored; then by name. `sorted` with a `key` that returns a tuple does all four at once; put a minus sign in front of the numbers that should go from largest to smallest.

## The table

Print an empty line, then the table, every column lined up:

```text
Pos  Team     P  W  D  L  GF  GA   GD  Pts  Form
  1  Tigers   5  2  2  1  11   5   +6    8  DWD
  2  Lions    5  2  2  1  10   8   +2    8  WLD
  3  Wolves   5  1  3  1   4   6   -2    6  DLW
  4  Bears    5  1  1  3   3   9   -6    4  LWL
```

The columns are, separated as shown: the position right-aligned in 3 characters, two spaces, the team left-aligned as wide as the longest team name (at least 4, the width of `Team`), two spaces, then `P`, `W`, `D`, `L` right-aligned in 2 each, `GF` and `GA` in 3, `GD` in 4 with its sign always shown, `Pts` in 4, two spaces, and the form. The header uses the same widths.

f-strings align for you: `f"{name:<{width}}"` pads a name on the right to `width` characters, `f"{n:>3}"` pads a number on the left, and `f"{gd:>+4}"` adds the sign, `+0` included.

## Form

The last column, `Form`, is the team's last three results, oldest first: Tigers drew, won, then drew. A team that played fewer than three matches shows the ones it has. A string slice, `form[-3:]`, gives the last three letters.

## Records

After the table, an empty line and three records:

```text
Biggest win: Tigers 4-0 Bears
Most goals: Tigers 4-0 Bears
Goals per match: 2.80
```

- **Biggest win** is the match with the largest difference between the scores
- **Most goals** is the match with the most goals in total
- on a tie, the match that came first in the file
- **Goals per match** is all goals divided by the matches, with two decimals

When no line was a result, print `No table yet` after the count, and nothing else.
