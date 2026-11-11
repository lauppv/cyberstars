Oliver and two friends are making a small space game, Star Miner, and every setting lives in one text file: the player's name, the volume, the screen, the saved games. The file nests, a group inside a group inside a list, in the format half the internet uses, JSON. They don't want a library for it; they want to understand it. So you'll write the reader: a **recursive** parser that turns the text into Java objects, finds any setting by its path, and reports a broken file with the line where it broke.

You build it one step at a time, in one `Main.java`. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests feed your parser settings files it has never seen, broken ones too. Passing them finishes the project.

## The file and the questions

The input is the settings file, then a line `---`, then questions, one per line, until `quit` (print `Bye`):

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
  "cheats": null,
  "mods": []
}
---
get graphics.resolution.width
```

A value is text in double quotes, a number (whole, or decimal with a `.`), `true`, `false`, `null`, a group of named values in `{ }`, or a list of values in `[ ]`. A `#` starts a comment that runs to the end of its line.

## Tokens

First cut the file into tokens, keeping each one's line number: each of `{ } [ ] : ,` on its own, a text without its quotes (remember it was a text, so `"true"` stays different from `true`), and every other run of letters, digits, `.`, `-` and `_` (numbers, `true`, `false`, `null`). A record holding the token's text, its line and whether it was quoted is all you need.

## The recursive reader

Now one method, `value()`, reads one value from the next tokens and returns it as a Java object:

- a text becomes a `String`, a whole number a `Long`, a decimal a `Double`, `true` and `false` a `Boolean`, `null` Java's `null`
- `{` starts a group: read a quoted name, a `:`, then a **value** (call `value()` again), then a `,` and the next name, or the `}` that ends it; collect them in a `LinkedHashMap`, which keeps the file's order
- `[` starts a list: read a **value**, then a `,` and the next one, or the `]`; collect them in an `ArrayList`

Because a group's values are read by `value()` itself, groups inside lists inside groups, to any depth, need no extra code. The whole file must be one group. Once it's read, print how many plain values (not groups or lists) it holds, at any depth:

```text
Read 16 values
```

## Finding a setting

`get <path>` finds a value by its path: names separated by dots, and `[n]` after a name for the list item `n`, counted from 0:

```text
get player
"Julia"
get graphics.resolution.width
1920
get saves[1].name
"Asteroid"
```

Texts print in quotes, decimals with at least one decimal (`2.0`), and a group or list as its size: `{3 settings}`, `[2 items]`. A path that leads nowhere prints `No such setting: graphics.colour`, and a question that isn't `get`, `type` or `print` with a path `Use get, type or print with a path`.

## What kind is it

`type <path>` says what a setting holds:

```text
volume is a decimal number
cheats is empty (null)
graphics is a group of 3 settings
```

The other kinds are `text`, `yes or no`, `a whole number` and `a list of 4 items` (`1 item`, `1 setting` for one).

## Broken files

A file with a mistake must say where it is, and then answer nothing. Stop at the first problem and print it with its line:

- `Line 7: expected , or } but found "shadows"`, and the same with `]` in a list, or `expected : but found ...`
- `Line 3: expected a name in quotes but found volume`
- `Line 4: "volume" twice`
- `Line 2: a string that never ends`, `Line 5: unexpected @`
- `Line 9: the file ends before }` when the file stops in the middle of a value
- `Line 1: the settings must be an object in { }`, and `Line 12: more after the end: {` for anything after the last `}`

Throwing an exception class of your own from deep inside the recursion, and catching it once at the top, is how real parsers do it.

## Print it back

`print <path>` writes a setting back out, neatly: groups and lists one item per line, indented by two spaces per level, a `,` after every item but the last, and empty ones as `{}` or `[]`:

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

`print .` prints the whole file. Printing is recursive too: a method that prints a value, and calls itself for each item, one level deeper. Oliver's team now edit their settings without fear.
