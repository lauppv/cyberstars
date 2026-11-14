Maya is eight and loves drawing on her dad's old laptop, in a program that paints with letters and signs on a small grid. Her favourite button is undo. She presses it all the time, and sometimes once too many, and then she wants her drawing back. You will write that drawing program in Java, with undo and redo for every tool, the way real editors do it: every action is an object that knows how to do itself and how to take itself back.

**How it works.** The program first reads the size of the canvas, then commands, and answers each command at once. Here is a session as you see it in the output box when you run a finished program. The lines you type are followed by the program's answers:

```text
12 6
Canvas 12x6
rect 1 1 6 4 #
Drew rect 1 1 6 4 #
fill 3 2 o
Drew fill 3 2 o
text 8 1 HI
Drew text 8 1 HI
show
............
.######.HI..
.#oooo#.....
.#oooo#.....
.######.....
............
line 0 5 11 5 =
Drew line 0 5 11 5 =
undo
Undid line 0 5 11 5 =
undo
Undid text 8 1 HI
redo
Redid text 8 1 HI
fill 0 0 ~
Drew fill 0 0 ~
show
~~~~~~~~~~~~
~######~HI~~
~#oooo#~~~~~
~#oooo#~~~~~
~######~~~~~
~~~~~~~~~~~~
history
1. rect 1 1 6 4 #
2. fill 3 2 o
3. text 8 1 HI
4. fill 0 0 ~
quit
Bye
```

The commands:

| Command                                | What it does                                   |
| -------------------------------------- | ---------------------------------------------- |
| `show`                                 | prints the canvas                              |
| `rect <x> <y> <width> <height> <char>` | draws the outline of a rectangle               |
| `line <x1> <y1> <x2> <y2> <char>`      | draws a line, straight across or straight down |
| `text <x> <y> <word>`                  | writes a word                                  |
| `fill <x> <y> <char>`                  | paints an area, like a paint bucket            |
| `undo`                                 | takes back the last drawing                    |
| `redo`                                 | does again what `undo` took back               |
| `history`                              | lists the drawings done                        |
| `quit`                                 | ends the program                               |

`(x, y)` is a cell: `x` is the column and `y` is the row, both counted from 0 at the top left. `<char>` is the character to draw with.

**To try your program**, press Run, then type or paste the lines in the output box. `quit` ends the program.

Build the program one step at a time, in one `Main.java`. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests draw other pictures, with a lot of undo. Passing them finishes the project.

## The canvas

Read every line with a `Scanner` (`nextLine()`) and split it into words. The first line is the canvas's width and height. The canvas is a `char[height][width]`, with `.` in every cell at the start.

Print `Canvas 12x6`, then read commands until `quit`, and print `Bye` then. `show` prints the canvas, one row on each line. For any other word, print `Unknown command: paint`.

## A command is an object

Write an interface with what every drawing action can do:

```java
interface Command {
    void apply();
    void undo();
    String describe();
}
```

The first tool is `rect <x> <y> <width> <height> <char>`: the outline of a rectangle, with its top left corner at `(x, y)`. Make a class `Rect` that implements `Command`. When a command is typed, make its object, call `apply()`, and print what was drawn with `describe()`:

```text
rect 1 1 6 4 #
Drew rect 1 1 6 4 #
```

Cells outside the canvas are not painted.

## Lines and words

Two more tools, each one a class of its own:

- `line <x1> <y1> <x2> <y2> <char>` draws a line straight across or straight down, with both ends. For a line that would go on a slant, print `Lines go straight across or straight down`
- `text <x> <y> <word>` writes a word from `(x, y)` to the right

```text
Drew line 0 5 11 5 =
Drew text 8 1 HI
```

## Fill

`fill <x> <y> <char>` is the paint bucket. It paints the cell at `(x, y)`, and every cell joined to it (up, down, left or right) through cells with the same character the first cell had:

```text
.######.HI..
.#oooo#.....
.#oooo#.....
.######.....
```

Use a queue (an `ArrayDeque`): paint the first cell and put it in the queue. Then, while the queue is not empty, take a cell out, and paint and put in the queue every neighbour that still has the old character. Filling with the character the cell already has changes nothing.

## Undo

Every command must be able to take itself back. The simplest way, which works for all of them: before a command paints a cell, it remembers what the cell was (only the first time, if it paints the same cell twice). `undo()` puts every remembered cell back. Write this only once, in an abstract class that all four tools extend.

Keep the commands that were done in a stack (an `ArrayDeque`, with `push` and `pop`). `undo` takes the last one off the stack and undoes it:

```text
undo
Undid line 0 5 11 5 =
```

When there is nothing to undo, print `Nothing to undo`.

## Redo

Undone commands go onto a second stack. `redo` takes the last one off it, applies it again, and puts it back on the first stack: `Redid text 8 1 HI`. When there is nothing to redo, print `Nothing to redo`.

Drawing something new empties the redo stack: when Maya draws something else after an undo, the old drawings can't come back, as in every editor.

## History

`history` lists the commands done, the oldest first, with numbers. Then, if some commands can be redone, how many:

```text
1. rect 1 1 6 4 #
2. fill 3 2 o
3. text 8 1 HI
Can redo: 1
```

With nothing done, the first line is `Nothing drawn`.

Last, wrong input must never stop the program:

- a command with the wrong number of words prints how to use it: `Usage: rect <x> <y> <width> <height> <char>`, `Usage: line <x1> <y1> <x2> <y2> <char>`, `Usage: text <x> <y> <word>` or `Usage: fill <x> <y> <char>`
- a coordinate that is not a number prints `Not a number: two`
- a drawing character longer than one prints `Draw with a single character, not ##`

Now Maya can undo as much as she likes.
