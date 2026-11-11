The rangers of a national park in the Alps plan their firebreaks, strips of land with no trees, and want to see what a fire would do before summer comes. They give you a map of a patch of forest, the wind, and where a fire might start. You'll write the simulation: minute by minute, the fire spreads from tree to tree, the wind pushes it further, and water stops it.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests burn forests your program has never seen (on the screen only). Passing them finishes the project.

## The map

The first line is the map's height, its width and the most steps to simulate; the second, the wind; then the map, one row per line:

```text
6 10 10
wind: east
TTTT.TTTTT
TFTT.TT#TT
TTTT..T#TT
TT.TTTT#TT
TT.TT.TTTT
TTTTT.TTT.
```

`T` is a tree, `F` a tree on fire, `.` bare ground and `#` water. Later, `x` is ash, a tree that burned. The wind is `north`, `south`, `east`, `west` or `none`.

Keep the map as a list of rows, each a list of characters. Print a line about it (the trees count the ones on fire too) and the map:

```text
Forest 6x10, 48 trees, wind east
```

## One step

In a step, every cell changes at the same moment, looking only at the map as it was before the step:

- a tree on fire burns out: it becomes ash
- a tree next to a tree on fire (above, below, left or right) catches fire

The trap: if you change the map while you go through it, a tree that just caught fire would set its neighbours alight in the same step, and the fire would cross the forest in one go. So build the new map in a **copy** (`[row[:] for row in forest]`), reading from the old one and writing to the new one, and use the copy for the next step.

## Step after step

Print an empty line, `Step 1` and the map after it, then the same for every next step, until no tree is on fire or the most steps are done:

```text
Step 1
TFTT.TTTTT
FxFF.TT#TT
TFTT..T#TT
TT.TTTT#TT
TT.TT.TTTT
TTTTT.TTT.
```

## The wind

Wind carries sparks. With a wind blowing, a tree also catches fire when the cell **two** cells upwind of it is on fire: with wind `east`, the tree two cells to the right of a fire catches too, over whatever is between them (a gap in the trees doesn't stop sparks).

Upwind means the side the wind comes from: an `east` wind blows towards the east, so it comes from the west, and the fire two cells to a tree's left reaches it. A dictionary from each direction to its step, like `'east': (0, 1)`, keeps this to a few lines.

## Water

Sparks don't fly over water: when the cell between the fire and the tree is `#`, the wind can't carry the fire across. And fire never burns water or bare ground.

## The rangers' report

After the last step, an empty line and the report: how many of the trees burned (ash, or still on fire) and their share rounded with `round`, how many are still standing, and how it ended:

```text
Burned: 48 of 48 (100%)
Standing: 0
The fire went out after 9 steps
```

The last line is one of three: `The fire went out after 9 steps` (`1 step` for one), `Still burning after 10 steps` when the most steps ran out with fire left, or `There was no fire` when the map had none to start with. A forest without trees reports `Burned: 0 of 0 (0%)`. The rangers will try a wider firebreak next.
