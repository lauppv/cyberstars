Two friends are making a pixel-art game for a phone with very little memory. Their levels are maps drawn with characters, and most of a map is the same character over and over: walls, floor, water. Instead of storing `####################`, they want to store `20#`. You'll write the tool that packs their levels this way, run-length encoding, unpacks them again, and proves that nothing gets lost on the way.

You build it one step at a time, in one C file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests pack and unpack levels your program has never seen. Passing them finishes the project.

## What to do with which lines

The first line says what to do, `compress` or `expand`, and every line after it, until the input ends, is a line of the level. Read them all with `fgets` (at most 100 lines of up to 500 characters), taking the newline off each. Any other first line prints `The first line must be compress or expand`.

```text
compress
####################
#..................#
#..@.......$$$.....#
```

## Runs

A **run** is the same character several times in a row. To compress a line, replace every run with how long it is followed by the character; a character on its own stays as it is, with no count:

```text
#..@.......$$$.....#
#2.@7.3$5.#
```

Print every compressed line in order. Write it as a function that fills an output string; `sprintf` writes a number and a character into a small buffer you can then add with `strcat`.

## Long runs

A run can be longer than 9: `20#` has a two-digit count. Your function handles it if it counts the whole run before writing; check that a line of 120 identical characters becomes `120` and the character.

## How much was saved

After the compressed lines, an empty line and the sizes, every line's characters added up before and after, and the share saved, rounded down:

```text
120 characters -> 36 (70% saved)
```

An empty level has nothing to save: print only `0 characters -> 0`.

## Expanding

With `expand` first, the lines are compressed ones: turn each back into the level, the count saying how many times to repeat the character after it, and print the level. Then the same kind of size line, without the share:

```text
19 characters -> 60
```

Reading a count is like reading a number anywhere: digit after digit, `count = count * 10 + (c - '0')`.

## Broken data

A compressed file can arrive damaged. Before printing anything, check every line, and stop at the first problem:

- a count at the very end of a line, with no character to repeat: `Line 3: a count with no character`
- a count of 0 or 1, which compressing never writes: `Line 2: a count below 2`

And when compressing, a level with a digit in it can't be compressed this way, since the digit would read as a count: `Line 4: digits can't be compressed`, before printing anything.

## Prove it

A compressor that loses data is worse than none. After compressing, expand every compressed line again in memory and compare it with the original line (`strcmp`). Print the result as the last line:

```text
Check: OK
```

Or `Check: FAILED` if any line came back different. With your program working, it always says OK; it's the line that would tell the friends the day something breaks.
