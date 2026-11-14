Oliver and two friends are making a small space game, Star Miner. All its settings are in one text file: the player's name, the sound, the screen, the saved games. The file has groups inside groups inside lists, written in JSON, a format used all over the internet. The friends don't want a ready-made library for it: they want to understand it. So you will write, in Java, the reader: a **recursive** parser that turns the text into Java objects, finds any setting by its path, and says on which line a broken file is broken.

**The input** is the settings file, then a line `---`, then questions, one on each line, until `quit`:

```text
# Settings for Star Miner
{
  "player": "Julia",
  "volume": 0.8,
  "graphics": {
    "fullscreen": true,
    "resolution": { "width": 1920, "height": 1080 },
    "shadows": "high"
  },
  "controls": ["W", "A", "S", "D"],
  "saves": [
    { "name": "Moon base", "level": 4 },
    { "name": "Asteroid", "level": 7, "hard": true }
  ],
  "cheats": null,
  "mods": []
}
---
get player
get graphics.resolution.width
get controls[2]
get saves[1].name
get saves
type volume
type cheats
type graphics
get graphics.colour
get saves[5].name
print graphics
print mods
print saves[0]
fly away
quit
```

**The output** for this input, when the program is finished:

```text
Read 16 values
"Julia"
1920
"S"
"Asteroid"
[2 items]
volume is a decimal number
cheats is empty (null)
graphics is a group of 3 settings
No such setting: graphics.colour
No such setting: saves[5].name
{
  "fullscreen": true,
  "resolution": {
    "width": 1920,
    "height": 1080
  },
  "shadows": "high"
}
[]
{
  "name": "Moon base",
  "level": 4
}
Use get, type or print with a path
Bye
```

What a value can be in the file:

| In the file              | What it is                   | In Java         |
| ------------------------ | ---------------------------- | --------------- |
| `"Julia"`                | a text, in double quotes     | `String`        |
| `1920`                   | a whole number               | `Long`          |
| `0.8`                    | a decimal number, with a `.` | `Double`        |
| `true`, `false`          | yes or no                    | `Boolean`       |
| `null`                   | empty                        | `null`          |
| `{ "name": value, ... }` | a group of named values      | `LinkedHashMap` |
| `[ value, ... ]`         | a list of values             | `ArrayList`     |

A `#` starts a comment, up to the end of its line.

The questions:

| Question       | What it does                           |
| -------------- | -------------------------------------- |
| `get <path>`   | prints the value of a setting          |
| `type <path>`  | says what kind of value a setting is   |
| `print <path>` | writes a setting back, nicely laid out |
| `quit`         | ends the program                       |

A path is names with dots between them, like `graphics.resolution.width`, and `[n]` after a name for item `n` of a list, counted from 0: `saves[1].name`.

**To try your program**, press Run, click in the output box and paste the input. The program answers the questions one by one, and stops at `quit`.

Build the program one step at a time, in one `Main.java`. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your parser other settings files, broken ones too. Passing them finishes the project.

## The file and the questions

Read the lines of the file until the line `---`. Then read the questions, one on each line, until `quit`, and print `Bye` then.

## Tokens

First cut the file into tokens, and keep each token's line number. A token is:

- each of `{ } [ ] : ,`, on its own
- a text, without its quotes. Remember that it was a text, so `"true"` stays different from `true`
- any other group of letters, digits, `.`, `-` and `_` (numbers, `true`, `false`, `null`)

A record with the token's text, its line, and whether it had quotes is all you need.

## The recursive reader

Now write one method, `value()`, that reads one value from the next tokens and gives it back as a Java object (see the table above):

- `{` starts a group. Read a name in quotes, a `:`, then a **value**: call `value()` again. Then either a `,` and the next name, or the `}` that ends the group. Keep the values in a `LinkedHashMap`, which keeps the file's order
- `[` starts a list. Read a **value**, then either a `,` and the next value, or the `]`. Keep the values in an `ArrayList`

A group's values are read by `value()` itself, so groups inside lists inside groups work at any depth, with no more code. The whole file must be one group.

When it is read, print how many simple values it has (not counting groups and lists), at any depth:

```text
Read 16 values
```

## Finding a setting

`get <path>` finds a value by its path:

```text
get player
"Julia"
get graphics.resolution.width
1920
get saves[1].name
"Asteroid"
```

Print texts in quotes, and decimals with at least one decimal (`2.0`). A group or a list prints as its size: `{3 settings}`, `[2 items]`.

When a path leads nowhere, print `No such setting: graphics.colour`. For a line that is not `get`, `type` or `print` with a path, print `Use get, type or print with a path`.

## What kind is it

`type <path>` says what a setting holds:

```text
volume is a decimal number
cheats is empty (null)
graphics is a group of 3 settings
```

The other kinds are `text`, `yes or no`, `a whole number` and `a list of 4 items`. For one, write `1 item` and `1 setting`.

## Broken files

A file with a mistake must say where the mistake is, and then answer no questions. Stop at the first problem, and print it with its line:

| Error                                                | When                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| `Line 7: expected , or } but found "shadows"`        | a group goes on without a `,` (and the same with `]` in a list) |
| `Line 7: expected : but found ...`                   | a name without `:` after it                                     |
| `Line 3: expected a name in quotes but found volume` | a name without quotes                                           |
| `Line 4: "volume" twice`                             | the same name twice in one group                                |
| `Line 2: a string that never ends`                   | a `"` with no `"` to close it                                   |
| `Line 5: unexpected @`                               | a character that can't be in the file                           |
| `Line 9: the file ends before }`                     | the file stops in the middle of a value                         |
| `Line 1: the settings must be an object in { }`      | the file is not one group                                       |
| `Line 12: more after the end: {`                     | something after the last `}`                                    |

Real parsers do it like this: they throw an exception class of their own from deep inside the recursion, and catch it once, at the top.

## Print it back

`print <path>` writes a setting back, nicely laid out:

- a group or a list has one item on each line, with two more spaces in front for each level
- every item but the last has a `,` after it
- an empty group is `{}`, and an empty list is `[]`

```text
print graphics
{
  "fullscreen": true,
  "resolution": {
    "width": 1920,
    "height": 1080
  },
  "shadows": "high"
}
```

`print .` prints the whole file. Printing is recursive too: a method that prints a value calls itself for each item, one level deeper. Now Oliver's team can change their settings without fear.
