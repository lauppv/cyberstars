A small online bookshop bought a warehouse robot: a little cart that drives between the shelves and brings boxes to the packing table. It came with no software. The owner draws the warehouse as a map of characters and writes the list of stations to visit; your program finds the shortest way between them, adds up the trip, and draws the route on the map so the owner can check it.

You build it one step at a time, in one C file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests send your robot through warehouses it has never seen. Passing them finishes the project.

## The map and the order

The first line is the map's height and width (at most 30 by 60), then the map, one row per line, then the order:

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

`R` is where the robot starts and parks, `#` a shelf it can't drive through, `.` floor, and every other capital letter a station. The order lists the stations to visit, in that order, then the robot drives back to `R`. Read the rows with `scanf("%60s", ...)`, skip the word `pick:`, and read the letters until the input ends.

Print a line about the job, counting the stations on the map (every capital letter but `R`):

```text
Warehouse 7x12, 5 stations, 3 to pick
```

## How far is everything

The robot moves one square at a time, up, down, left or right. To find the shortest way from one square to every other, use a **breadth-first search**: a queue of squares, as two arrays (row and column) with a head and a tail index.

1. mark every square's distance as unknown (-1), the start's as 0, and put the start in the queue
2. take the square at the head; for each neighbour, in the order up, down, left, right, that's inside the map, not a shelf and still unknown: its distance is one more, and it goes at the tail
3. repeat until the queue is empty

Because the queue hands out squares in the order they were found, every square is first reached by a shortest way.

## One leg

Run the search from the robot's square and read the distance of the first station. Print the leg:

```text
R -> C: 12 steps
```

## The whole round

Then from that station to the next, and so on, and finally back to `R`. Each leg starts a new search from where the robot is. After the last leg, the total:

```text
R -> C: 12 steps
C -> A: 12 steps
A -> E: 6 steps
E -> R: 10 steps
Total: 40 steps
```

## When it can't go

Two things stop the round, after the legs printed so far:

- a station in the order that isn't on the map: `A -> Z: no station Z`
- a station shelves cut off completely: `A -> D: can't get there` (its distance stayed -1)

## Draw the route

After the total, an empty line and the map with the route drawn on it: every floor square any leg drove over becomes `*`, while stations and `R` keep their letters.

```text
R*********..
.##*##.##*#.
.#A*#B.#C*#.
.##*##.##.#.
...***......
.#D.#E.###..
.##.##......
```

To know the way, not only its length, the search remembers for every square the square it was reached from. From the station, follow those back to the start and draw each square on the way. Searching neighbours in the order up, down, left, right decides which of several equally short ways is drawn. The owner checked the first trip by hand and found nothing shorter.
