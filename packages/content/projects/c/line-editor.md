Before screens could show a whole page, programmers edited files one line at a time with line editors: you asked for line 3, typed what it should say, and printed the file to see the result. Servers still ship one for when nothing else works. You'll write your own: it holds a text file in memory, line by line, lets you add, change and remove lines, takes back your last mistake and saves to disk.

You build it one step at a time, in one C file. Every step adds a command, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Commands here carry text with spaces, so the program reads whole lines with `fgets` rather than words with `scanf`. Run it, then type the lines of an example yourself to see what it answers.

## Append and print

Print `Editor ready` when the program starts. Then read lines with `fgets` until one says `quit`, and print `Bye` then. `fgets` keeps the Enter at the end of the line; cut it off first (`buf[strcspn(buf, "\n")] = '\0'`).

- `append <text>` adds a line at the end and prints it with its number
- `print` prints every line with its number, or `(empty)` when there's none

```text
append Shopping list
1: Shopping list
append milk
2: milk
print
1: Shopping list
2: milk
```

To tell commands apart, compare the start of the line with `strncmp(buf, "append ", 7)`; the text then starts at `buf + 7`. A line that matches no command prints `Unknown command: cook dinner`, and an empty line nothing.

## Only the memory each line needs

A file of 1000 short lines shouldn't take 1000 times the size of the longest one. Keep the file as an array of pointers, `char *lines[1000]`, and give each line exactly the bytes it needs: `malloc(strlen(text) + 1)` for the characters and the `'\0'` that ends them, then `strcpy` into it.

Write it as a function that returns a fresh copy of a string; every command that adds text uses it. When the file already has 1000 lines, `append` prints `The file is full`.

## Insert

`insert <line> <text>` puts a new line before the one with that number; the lines after it move down. Inserting at one past the last line adds it at the end:

```text
insert 2 eggs
2: eggs
```

To read the number and find where the text starts, `sscanf(rest, "%d %n", &num, &used)` reads the number and stores in `used` how many characters it went through, the spaces after the number included, so the text is at `rest + used`. A number outside the file prints `No line 9`.

## Delete

`delete <line>` removes a line; the ones after it move up:

```text
delete 1
Deleted line 1: Shopping list
```

The memory of a removed line has to go back with `free`, or a long editing session slowly eats the machine. (Hold on to it for one more step, though: undo needs it.) A number outside the file prints `No line 9`.

## Replace

`replace <line> <text>` changes what a line says:

```text
replace 3 two litres of milk
3: two litres of milk
```

The new text needs its own memory, and the old one must be freed (or kept for undo). A number outside the file prints `No line 9`.

## Undo

`undo` takes back the last `append`, `insert`, `delete` or `replace`:

```text
undo
Undid deleting line 1
```

The other answers are `Undid adding line 4` (for an `append` or an `insert`) and `Undid replacing line 3`. Only one step back: a second `undo` prints `Nothing to undo`, and so does one before any change.

To undo you need to remember what the last change was, at which line, and for a delete or a replace the old text. Keep that old line's memory instead of freeing it right away, and free it once a newer change makes it useless.

## Find and count

- `find <text>` prints every line containing that text (`strstr` finds one string inside another), with its number, or `Not found: tea`
- `stats` counts the lines, the words (runs of characters between spaces) and the characters, spaces included

```text
find milk
3: two litres of milk
stats
4 lines, 10 words, 51 characters
```

## Save and open

- `save <file>` writes every line to a file, each followed by a newline: `Saved 4 lines to list.txt`
- `open <file>` throws away the lines in memory (free them all), reads the file's lines instead, and forgets the undo: `Opened list.txt, 4 lines`

A file that can't be opened prints `Cannot read nope.txt` or `Cannot write ...`, and the lines in memory stay as they were.

Finally, check that `delete x`, `insert two eggs` and `replace 3` (no text) print `Usage: delete <line>`, `Usage: insert <line> <text>` and `Usage: replace <line> <text>`, and that every line still in memory is freed before the program ends.
