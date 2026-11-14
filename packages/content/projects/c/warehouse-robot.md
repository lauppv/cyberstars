A small online bookshop bought a robot for its warehouse: a little cart that drives between the shelves and brings boxes to the table where orders are packed. It came with no program. The owner draws the warehouse as a map of characters and writes the list of places to visit. Your C program finds the shortest way between them, adds up the whole trip, and draws the way on the map, so the owner can check it.

**The input** starts with the map's height and width. Then comes the map, one row on each line, and last, the order: the stations to visit:

```text
7 12
R...........
.##.##.##.#.
.#A.#B.#C.#.
.##.##.##.#.
............
.#D.#E.###..
.##.##......
pick: C A E
```

The characters of the map:

| Character                | What it is                                           |
| ------------------------ | ---------------------------------------------------- |
| `R`                      | the robot's home: it starts here and comes back here |
| `#`                      | a shelf: the robot can't drive through it            |
| `.`                      | floor                                                |
| any other capital letter | a station, a place the robot can visit               |

**The output** for this input, when the program is finished:

```text
Warehouse 7x12, 5 stations, 3 to pick
R -> C: 12 steps
C -> A: 12 steps
A -> E: 6 steps
E -> R: 10 steps
Total: 40 steps

R*********..
.##*##.##*#.
.#A*#B.#C*#.
.##*##.##.#.
...***......
.#D.#E.###..
.##.##......
```

The robot goes to C, then A, then E, then home. Each part of the trip is a leg. The `*` squares show where it drove.

**To try your program**, press Run, click in the output box and paste the input. Then press **End input** under the output box (or Ctrl + D): the program reads the order until the input ends.

Build the program one step at a time, in one C file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests send your robot through other warehouses. Passing them finishes the project.

## The map and the order

Read the height and the width (at most 30 by 60). Read each row of the map with `scanf("%60s", ...)`. Then skip the word `pick:` and read the station letters until the input ends.

Print one line about the job. The stations are all the capital letters on the map except `R`:

```text
Warehouse 7x12, 5 stations, 3 to pick
```

## How far is everything

The robot moves one square at a time: up, down, left or right. To find the shortest way from one square to every other square, use a **breadth-first search**. It needs a queue of squares: two arrays (for the row and the column), with an index for the head, where squares come out, and one for the tail, where squares go in.

1. set every square's distance to -1, which means not known yet. Set the start's distance to 0, and put the start in the queue
2. take the square at the head. Look at its neighbours in the order up, down, left, right. A neighbour that is inside the map, not a shelf, and still at -1 gets the distance of this square plus one, and goes in at the tail
3. do it again until the queue is empty

The queue gives the squares out in the order they were found, so every square is first reached by a shortest way.

## One leg

Run the search from the robot's square, and read the distance of the first station. Print the leg:

```text
R -> C: 12 steps
```

## The whole round

Then go from that station to the next one, and so on, and at the end back to `R`. Each leg starts a new search from where the robot is. After the last leg, print the total:

```text
R -> C: 12 steps
C -> A: 12 steps
A -> E: 6 steps
E -> R: 10 steps
Total: 40 steps
```

## When it can't go

Two things stop the trip, after the legs printed so far:

- a station in the order that is not on the map: `A -> Z: no station Z`
- a station the shelves close in on every side: `A -> D: can't get there` (its distance stayed -1)

## Draw the route

After the total, print an empty line and the map with the way drawn on it. Every floor square that any leg went over becomes `*`. The stations and `R` keep their letters:

```text
R*********..
.##*##.##*#.
.#A*#B.#C*#.
.##*##.##.#.
...***......
.#D.#E.###..
.##.##......
```

To know the way, not only how long it is, the search must remember for every square the square it came from. From the station, follow these back to the start, and draw each square on the way.

There can be several shortest ways. Looking at the neighbours in the order up, down, left, right decides which one is drawn, so your map is the same as the tests' map. The owner checked the first trip by hand and found nothing shorter.
