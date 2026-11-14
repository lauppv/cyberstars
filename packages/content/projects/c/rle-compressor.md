Two friends are making a pixel art game for a phone with very little memory. Their levels are maps drawn with characters, and most of a map is the same character again and again: walls, floor, water. Instead of keeping `####################`, they want to keep `20#`. This is called run-length encoding. You will write the tool, in C, that packs their levels this way, unpacks them again, and shows that nothing is lost.

**The input** starts with one word, `compress` or `expand`. Every line after it is one line of the level:

```text
compress
####################
#..................#
#..@.......$$$.....#
#..........#####...#
#~~~~~~~~~~~~~~~~~~#
####################
```

**The output** for this input, when the program is finished:

```text
20#
#18.#
#2.@7.3$5.#
#10.5#3.#
#18~#
20#

120 characters -> 36 (70% saved)
Check: OK
```

And with `expand`, the program does the opposite. This input:

```text
expand
20#
#18.#
#2.@7.3$5.#
```

gives this output:

```text
####################
#..................#
#..@.......$$$.....#

19 characters -> 60
```

Some words you will meet:

| Word     | What it means                                                                  |
| -------- | ------------------------------------------------------------------------------ |
| run      | the same character several times in a row, like `$$$`                          |
| count    | the number before a character, saying how many times it repeats: `3$` is `$$$` |
| compress | make the level shorter by writing each run as a count and a character          |
| expand   | turn the short form back into the level                                        |

**To try your program**, press Run, click in the output box and paste the input. Then press **End input** under the output box (or Ctrl + D): the program reads lines until the input ends.

Build the program one step at a time, in one C file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests pack and unpack other levels. Passing them finishes the project.

## What to do with which lines

The first line says what to do: `compress` or `expand`. Every line after it, until the input ends, is a line of the level. Read them all with `fgets` (at most 100 lines of up to 500 characters each), and take the newline off the end of each one.

If the first line is something else, print `The first line must be compress or expand`.

## Runs

To compress a line, write every run as its length and then the character. A character that is there only once stays as it is, with no count:

```text
#..@.......$$$.....#
```

becomes

```text
#2.@7.3$5.#
```

Print every compressed line, in order.

Write this as a function that fills an output string. `sprintf` writes a number and a character into a small buffer, and then `strcat` adds the buffer to the output.

## Long runs

A run can be longer than 9: `20#` has a count with two digits. Your function does this right if it counts the whole run before it writes anything. Check that a line of 120 same characters becomes `120` and the character.

## How much was saved

After the compressed lines, print an empty line and the sizes: the characters of all the lines added up, before and after, and the part saved in percent, rounded down:

```text
120 characters -> 36 (70% saved)
```

An empty level has nothing to save: print only `0 characters -> 0`.

## Expanding

When the first line is `expand`, the lines are compressed. Turn each one back into the level: a count says how many times to repeat the character after it. Print the level, then an empty line and the sizes, without the percent:

```text
19 characters -> 60
```

You read a count like any number: digit by digit, `count = count * 10 + (c - '0')`.

## Broken data

A compressed file can arrive broken. Before you print anything, check every line, and stop at the first problem:

| Error                               | When                                                          |
| ----------------------------------- | ------------------------------------------------------------- |
| `Line 3: a count with no character` | a count at the very end of a line, with no character after it |
| `Line 2: a count below 2`           | a count of 0 or 1, which compressing never writes             |

And when you compress: a level with a digit in it can't be compressed this way, because the digit would look like a count. Print `Line 4: digits can't be compressed` before you print anything.

## Prove it

A compressor that loses data is worse than no compressor. After compressing, expand every compressed line again, in memory, and compare it with the line it came from (`strcmp`). Print the result as the last line:

```text
Check: OK
```

If any line came back different, print `Check: FAILED`. When your program works, it always says OK. This line is there to tell the friends on the day something breaks.
