Four teams play football in the park every Sunday. Oliver writes each result in a text file on his phone. At the end of the season he wants a league table: the teams in order from best to worst, with their numbers, like the tables on sports websites.

Your program reads Oliver's file and prints that table.

**The input** is one match on each line: the first team, the score, the second team. `Lions 2-1 Tigers` means Lions scored 2 goals and Tigers scored 1. Here is a whole season. Some lines have mistakes, and one is empty:

```text
Lions 2-1 Tigers
Bears 0-0 Wolves
Tigers 4-0 Bears
Wolves 2-2 Lions
Lions 3-1 Bears
Tigers 1-1 Wolves
Bears 2-1 Lions
Wolves 0-3 Tigers
Lions 2:1 Wolves

Tigers 2-2 Lions
Wolves 1-0 Bears
Eagles 1-0
Lions 1-1 Lions
```

**The output** for this season, when the program is finished:

```text
10 matches read
Line 9 skipped: Lions 2:1 Wolves
Line 13 skipped: Eagles 1-0
Line 14 skipped: Lions 1-1 Lions

Pos  Team     P  W  D  L  GF  GA   GD  Pts  Form
  1  Tigers   5  2  2  1  11   5   +6    8  DWD
  2  Lions    5  2  2  1  10   8   +2    8  WLD
  3  Wolves   5  1  3  1   4   6   -2    6  DLW
  4  Bears    5  1  1  3   3   9   -6    4  LWL

Biggest win: Tigers 4-0 Bears
Most goals: Tigers 4-0 Bears
Goals per match: 2.80
```

The columns of the table:

| Column | What it means |
| --- | --- |
| Pos | the team's place in the table |
| P | matches played |
| W | matches won |
| D | draws: matches that ended with the same score for both teams |
| L | matches lost |
| GF | goals for: goals the team scored |
| GA | goals against: goals the other teams scored against it |
| GD | goal difference: GF minus GA |
| Pts | points: 3 for each win, 1 for each draw, 0 for a loss |
| Form | the team's last three results: `W` win, `D` draw, `L` loss |

**To try your program**, press Run, click in the output box and paste the season. Then press **End input** under the output box (or Ctrl + D). This tells your program that there are no more lines, so it can print its answer.

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other seasons. Passing them finishes the project.

## Read all the lines

You don't know how many lines the file has, so read them in a loop. When there are no more lines, `input()` stops with an error called `EOFError`. Catch it and leave the loop:

```python
while True:
    try:
        line = input()
    except EOFError:
        break
```

Skip the empty lines and keep the others in a list. Then print how many you kept. With the season above you get this, because some wrong lines are still in the list:

```text
13 matches read
```

For one match, write `1 match read`. For any other number, `0` too, write `matches`.

## Skip the wrong lines

Oliver types fast on a small screen, so some lines are wrong. A line is a real result only when:

- it has exactly three words (`line.split()` gives you the words)
- the two teams have different names
- the score is two whole numbers with a `-` between them, like `2-1`

`"2".isdigit()` is `True` and `"two".isdigit()` is `False`.

Keep only the real results and count only them. After the count, print one line for each wrong line, with its number in the file. The first line is line 1, and empty lines count too:

```text
10 matches read
Line 9 skipped: Lions 2:1 Wolves
Line 13 skipped: Eagles 1-0
Line 14 skipped: Lions 1-1 Lions
```

Line 9 has `:` in place of `-`, line 13 has only two words, and on line 14 Lions plays against Lions.

## Count for every team

Now go through the real results and count, for every team, the numbers of the table: P, W, D, L, GF and GA. A dictionary works well: the team's name is the key, and the value is a small dictionary with its numbers.

Each match changes two teams. After `Lions 2-1 Tigers`:

- Lions: P + 1, W + 1, GF + 2, GA + 1
- Tigers: P + 1, L + 1, GF + 1, GA + 2

Also keep each team's results as a string of letters, adding `W`, `D` or `L` after every match. You need it for the Form column.

To check this step, print the dictionary, then remove the print. For the season above, Lions has played 5, won 2, drawn 2, lost 1, scored 10 goals and has 8 goals against.

## Sort the teams

A team's points are 3 for each win and 1 for each draw. Put the teams in this order:

1. more points first
2. on equal points, the bigger goal difference (GD) first
3. if that is equal too, more goals scored (GF) first
4. if everything is equal, by name, from A to Z

In the season above Tigers and Lions both have 8 points. Tigers comes first because its goal difference is +6 and Lions' is +2.

`sorted` with a `key` that gives a tuple sorts by many things at once. A minus sign in front of a number sorts it from big to small. For example, players by score from high to low, then by name:

```python
sorted(players, key=lambda p: (-score[p], p))
```

## Print the table

After the count and the skipped lines, print an empty line, then the header and one row for each team, in the order from the last step. Leave out the Form column for now.

The columns must line up exactly like in the output at the top, because the tests compare your output character by character:

| Column | Width | Side |
| --- | --- | --- |
| Pos | 3 | right |
| Team | the longest team name, at least 4 (the width of `Team`) | left |
| P, W, D, L | 2 each | right |
| GF, GA | 3 each | right |
| GD | 4, always with its sign: `+6`, `-2`, `+0` | right |
| Pts | 4 | right |

Put two spaces after Pos and after Team, and one space between the other columns. The header uses the same widths.

f-strings can do this for you:

- `f"{name:<{width}}"` adds spaces after a name until it is `width` characters long
- `f"{n:>3}"` adds spaces before a number until it is 3 characters long
- `f"{gd:>+4}"` does the same for 4 characters and always shows the sign

If no line was a real result, print `No table yet` after the count and the skipped lines, and nothing more.

## Add the Form column

Add the Form column at the end of the header and of every row, after two spaces.

Form is the team's last three results, the oldest first. Tigers drew, then won, then drew, so its form is `DWD`. A team that played fewer than three matches shows the ones it has. `form[-3:]` gives the last three letters of a string.

## Season facts

After the table, print an empty line and three facts about the season:

```text
Biggest win: Tigers 4-0 Bears
Most goals: Tigers 4-0 Bears
Goals per match: 2.80
```

- **Biggest win** is the match with the biggest difference between the two scores
- **Most goals** is the match with the most goals of both teams together
- if two matches are equal, take the one that comes first in the file: `Wolves 2-2 Lions` also has 4 goals, but it comes after `Tigers 4-0 Bears`
- **Goals per match** is all the goals of the season divided by the number of matches, with two digits after the point: 28 goals in 10 matches give `2.80`. `f"{x:.2f}"` shows two digits after the point
