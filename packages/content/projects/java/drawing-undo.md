Maya is eight and loves drawing on her dad's old laptop, in a program that paints with letters and symbols on a little grid. Her favourite button is undo: she presses it all the time, and sometimes presses it once too often and wants the drawing back. You'll write that drawing program, and the part that makes undo and redo work for every tool, the way real editors do it: every action is an object that knows how to do itself and how to take itself back.

You build it one step at a time, in one `Main.java`. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests draw pictures your program has never seen, with plenty of undo. Passing them finishes the project.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`.

## The canvas

The first line is the canvas's width and height. The canvas is a `char[height][width]`, every cell `.` to start with; cell `(x, y)` is column `x` and row `y`, both counted from 0 at the top left. Print `Canvas 12x6`, then read commands until `quit` (print `Bye` then). `show` prints the canvas, a row per line. Any other word prints `Unknown command: paint`.

## A command is an object

Write an interface with what every drawing action can do:

```java
interface Command {
    void apply();
    void undo();
    String describe();
}
```

The first tool is `rect <x> <y> <width> <height> <char>`: the outline of a rectangle with its top left corner at `(x, y)`. Make a `Rect` class that implements `Command`. When a command is typed, build its object, call `apply()`, and print what was drawn with `describe()`:

```text
rect 1 1 6 4 #
Drew rect 1 1 6 4 #
```

Cells outside the canvas are simply not painted.

## Lines and words

Two more tools, each a class of its own:

- `line <x1> <y1> <x2> <y2> <char>` draws a line straight across or straight down, both ends included; a line that would be slanted prints `Lines go straight across or straight down`
- `text <x> <y> <word>` writes a word from `(x, y)` to the right

```text
Drew line 0 5 11 5 =
Drew text 8 1 HI
```

## Fill

`fill <x> <y> <char>` is the paint bucket: it paints the cell at `(x, y)` and every cell connected to it, up, down, left or right, through cells of the same character the starting cell had:

```text
.######.HI..
.#oooo#.....
.#oooo#.....
.######.....
```

Painting cell by cell from a queue (an `ArrayDeque`) does it: paint the start, put it in the queue, and while the queue isn't empty, take a cell and paint and queue every neighbour that still has the old character. Filling with the character a cell already has changes nothing.

## Undo

Every command must be able to take itself back. The simplest way that works for all of them: whenever a command paints a cell, it first remembers what the cell was (only the first time, for a cell it paints twice). `undo()` puts every remembered cell back. Write that once, in an abstract class all four tools extend.

Keep the commands done in a stack (an `ArrayDeque` with `push` and `pop`). `undo` takes the last one off and undoes it:

```text
undo
Undid line 0 5 11 5 =
```

With nothing to undo, `Nothing to undo`.

## Redo

Commands undone go onto a second stack; `redo` takes the last one off it, applies it again and puts it back on the first: `Redid text 8 1 HI`, or `Nothing to redo`. Drawing something new clears the redo stack: once Maya draws over her mistake, the old branch is gone, as in every editor.

## History

`history` lists the commands done, oldest first, numbered, and how many could be redone, if any:

```text
1. rect 1 1 6 4 #
2. fill 3 2 o
3. text 8 1 HI
Can redo: 1
```

With nothing done, it starts with `Nothing drawn`. Finally, bad input never stops the program: a command with the wrong number of words prints its usage (`Usage: rect <x> <y> <width> <height> <char>`, `Usage: line <x1> <y1> <x2> <y2> <char>`, `Usage: text <x> <y> <word>`, `Usage: fill <x> <y> <char>`), a coordinate that isn't a number `Not a number: two`, and a colour longer than one character `Draw with a single character, not ##`. Maya can now undo as much as she likes.
