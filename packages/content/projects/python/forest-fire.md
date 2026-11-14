The people who look after a national park in the Alps want to know what a fire would do in their forest, before summer comes. They give you a map of a piece of forest, the wind, and the place where a fire might start. Your program shows the fire step by step: it goes from tree to tree, the wind pushes it further, and water stops it.

**The input** starts with one line of three numbers: the map's height, its width, and the most steps to show. The second line is the wind. Then comes the map, one row on each line:

```text
3 5 5
wind: none
TTTTT
TTFTT
TTTTT
```

The letters of the map:

| Letter | What it is                                                |
| ------ | --------------------------------------------------------- |
| `T`    | a tree                                                    |
| `F`    | a tree on fire                                            |
| `.`    | ground with no tree                                       |
| `#`    | water                                                     |
| `x`    | ash: a tree that has burned (it appears as the fire goes) |

The wind is `north`, `south`, `east`, `west` or `none`.

**The output** for this input, when the program is finished:

```text
Forest 3x5, 15 trees, wind none
TTTTT
TTFTT
TTTTT

Step 1
TTFTT
TFxFT
TTFTT

Step 2
TFxFT
FxxxF
TFxFT

Step 3
FxxxF
xxxxx
FxxxF

Step 4
xxxxx
xxxxx
xxxxx

Burned: 15 of 15 (100%)
Standing: 0
The fire went out after 4 steps
```

**To try your program**, press Run, click in the output box and paste the input. Then press **End input** under the output box (or Ctrl + D).

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other forests. Passing them finishes the project.

## The map

Read the first line and the wind, then the rows of the map. Keep the map as a list of rows, where each row is a list of characters, so you can change one cell later.

Print one line about the forest, then the map as it is. The trees count the trees on fire too:

```text
Forest 3x5, 15 trees, wind none
TTTTT
TTFTT
TTTTT
```

## One step

In one step, every cell changes at the same time:

- a tree on fire burns out: it becomes ash (`x`)
- a tree next to a tree on fire catches fire (`F`). Next to means above, below, left or right, not on a corner

Each cell looks only at the map as it was **before** the step. Be careful here: if you change the map while you go through it, a tree that just caught fire sets its neighbours on fire in the same step, and the fire crosses the whole forest at once.

So make a **copy** of the map first (`[row[:] for row in forest]`). Read from the old map, write into the copy, and use the copy for the next step.

## Step after step

After the first map, print an empty line, `Step 1` and the map after that step. Do the same for each next step. Stop when no tree is on fire, or when you have done the most steps from the first line:

```text
Step 1
TTFTT
TFxFT
TTFTT
```

## The wind

The wind carries small pieces of fire. When the wind blows, a tree also catches fire when the cell **two** cells away, on the side the wind comes from, is on fire. It does not matter what is between them: a gap in the trees does not stop it.

The wind is named for the way it goes. An `east` wind goes towards the east, so it comes from the west: a tree catches fire when the cell two places to its **left** is on fire.

Here is the first step of a forest with an `east` wind:

```text
TTTT.TTTTT        TFTT.TTTTT
TFTT.TT#TT        FxFF.TT#TT
TTTT..T#TT   ->   TFTT..T#TT
```

The tree two cells to the right of the fire caught too. A dictionary that gives each wind its direction, like `'east': (0, 1)`, keeps this short.

## Water

The wind can't carry fire over water: when the cell between the fire and the tree is `#`, the tree does not catch fire from that wind. Fire never burns water or ground with no tree.

## The report

After the last step, print an empty line and three lines:

```text
Burned: 15 of 15 (100%)
Standing: 0
The fire went out after 4 steps
```

- **Burned**: how many trees burned (ash, or still on fire), out of all the trees, and the percent rounded with `round`
- **Standing**: how many trees are still green
- the last line is one of three:
  - `The fire went out after 4 steps` when no tree is on fire any more (`1 step` for one)
  - `Still burning after 5 steps` when the most steps are done and some trees are still on fire
  - `There was no fire` when the map had no fire at the start

A forest with no trees at all reports `Burned: 0 of 0 (0%)`.
