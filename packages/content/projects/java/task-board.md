A team of three runs a small web agency, and their to-do list lives on sticky notes on the wall: To do, Doing, Done. Notes fall off, nobody knows who's on what, and deadlines slip quietly. You'll write the board as a program: tasks in three columns, each with an owner, rules that keep anyone from juggling too much, deadlines and a weekly summary.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## The team

The program starts by reading the team: the first line is how many people, then one name per line. Print them on one line:

```text
Board for Ana, Dan, Ioana
```

Then keep reading commands until someone types `quit`, and print `Bye` then. Any other word prints `Unknown command: task`, and an empty line is skipped.

## Add tasks

`add <title>` puts a new task in To do. The title is the rest of the line, spaces and all. Tasks are numbered from 1:

```text
add Fix the login page
Task 1: Fix the login page
```

Make a `Task` class with its number, title, column and (soon) owner and due day, and keep the tasks in a `LinkedHashMap` by number, so they stay in the order they were added.

## The board

The three columns are an `enum`, `TODO`, `DOING` and `DONE`, each with the label it prints: `To do`, `Doing`, `Done`. `board` prints every column, in that order, with its tasks indented by two spaces, in the order they were added:

```text
board
To do:
  #1 Fix the login page
  #2 Write the welcome email
Doing:
Done:
```

Give `Task` a `toString()` that writes `#1 Fix the login page`; later steps add to it.

## Owners

`assign <task> <person>` gives a task to someone on the team:

```text
assign 1 Ana
#1 is Ana's
```

A name that isn't on the team prints `Mara is not on the team`, and a task that doesn't exist `No task 9`. Once a task has an owner, `toString()` adds it in brackets: `#1 Fix the login page (Ana)`.

## Moving tasks

`move <task> <todo|doing|done>` moves a task to a column (typed in any case), following the team's rules. Refuse, in this order, when:

- the column isn't one of the three: `Columns are todo, doing and done`
- the task is already there: `#1 is already in Doing`
- it has no owner and isn't going back to To do: `#1 needs someone first`
- it's going straight from To do to Done: `#1 has to be in Doing first`
- its owner already has 2 tasks in Doing: `Ana already has 2 tasks in Doing`

```text
move 1 doing
#1 moved to Doing
```

The last rule also holds for `assign`: giving a task that's in Doing to someone who already has 2 there prints the same line.

## Deadlines

`due <task> <day>` sets a task's due day, days counted from 1:

```text
due 2 4
#2 is due on day 4
```

The board shows it after the owner: `#2 Write the welcome email (Ana) due day 4`. `late <day>` lists the tasks not done whose due day is before that day, the earliest due first (then by number), with how late they are:

```text
late 7
#2 Write the welcome email (Ana) due day 4, 3 days late
#4 Back up the database due day 6, 1 day late
```

With nothing late, print `Nothing late on day 2`. A list of tasks sorted with `Comparator.comparingInt(...).thenComparingInt(...)` does the ordering in one line.

## My tasks

`mine <person>` shows one person's tasks, column by column, each with its column:

```text
mine Ana
Doing: #2 Write the welcome email
Doing: #3 Update the price list
Done: #1 Fix the login page
```

Someone with no task prints `Ioana has no tasks`, and a name not on the team the usual line.

## Friday summary

`stats` counts the tasks in each column, then how many tasks each person finished, the most first, ties by name:

```text
stats
To do: 1
Doing: 2
Done: 1
Ana finished 1
Dan finished 0
Ioana finished 0
```

Finally, make sure bad input never stops the program: `add` with no title prints `Usage: add <title>`, any command with the wrong number of words its usage line (`Usage: assign <task> <person>`, `Usage: move <task> <todo|doing|done>`, `Usage: due <task> <day>`, `Usage: late <day>`, `Usage: mine <person>`), and a number that isn't one `Not a number: soon`. Catch `NumberFormatException` around the command, and throw an `IllegalArgumentException` with the line to print for the rest.
