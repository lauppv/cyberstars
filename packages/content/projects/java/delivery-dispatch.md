Gustos is a food delivery start-up in a city laid out in a perfect grid of streets. Orders come in from restaurants, and a dispatcher on the phone decides which courier goes where. On a busy evening the dispatcher can't keep up. You'll write the dispatch program: it sends every order to the courier who can reach the restaurant soonest, moves the couriers block by block as the minutes pass, queues orders when everyone is busy, and keeps score of who delivered what and how fast.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## Couriers on the map

Every place in the city is a corner, `x,y`, on a grid of streets. Riding from one corner to the next is one block, so the distance between two corners is the blocks along `x` plus the blocks along `y` (no cutting through buildings).

The program starts by reading the couriers: how many, then one line each with their vehicle, name and starting corner:

```text
3
bike Ana 0 0
scooter Dan 6 6
bike Leo 2 1
```

A bike rides 1 block a minute, a scooter 2. Write an abstract `Courier` class with what every courier has (name, position) and an abstract method for its speed, and two subclasses, `Bike` and `Scooter`. Print `3 couriers on duty`, then keep reading commands until someone types `quit`, and print `Shift over` then. Any other word prints `Unknown command: fly`.

## Orders

`order <id> <rx> <ry> <cx> <cy>` is an order to pick up at the restaurant's corner and take to the customer's. It goes to the free courier who can reach the restaurant in the fewest minutes, blocks divided by speed and rounded up; on a tie, the first by name:

```text
order A1 1 1 4 3
Order A1 goes to Leo, 1 min to the restaurant
order A2 6 2 0 6
Order A2 goes to Dan, 2 min to the restaurant
```

An id that's taken prints `Order A1 exists already`. Let the courier work out its own minutes to a corner; that's where its speed matters.

## Nobody free

When every courier has an order, a new one waits in line, first come first served:

```text
order A4 0 0 1 1
Order A4 waits for a courier
```

`where` shows every courier, in the order they came, with their vehicle, corner and what they're doing (`free`, `going to pick up A3` or `taking A2`), then the orders waiting, if any:

```text
where
Ana (bike) at 0,0, going to pick up A3
Dan (scooter) at 6,6, going to pick up A2
Leo (bike) at 2,1, going to pick up A1
Waiting: A4
```

## Riding

`tick <minutes>` lets the minutes pass, one at a time. Every minute, each courier with an order, in the order they came, rides towards where they're going: as many blocks as their speed, first along `x` until it matches, then along `y`. Reaching the restaurant, they pick the order up; reaching the customer, they deliver it, and they're free:

```text
tick 9
Minute 1: Leo picked up A1
Minute 2: Dan picked up A2
Minute 6: Leo delivered A1 in 6 min
Minute 6: Leo takes A4
Minute 7: Dan delivered A2 in 7 min
```

A delivery's time counts from the minute the order came in. A courier who delivers takes the first waiting order at once, as Leo does. A scooter that reaches its corner with speed to spare stops there for that minute.

## Late deliveries

Gustos promises every order within 20 minutes. A delivery that takes longer says by how much:

```text
Minute 21: Ana delivered A3 in 21 min, 1 min late
```

Count the late ones; the report needs them.

## Cancelling

`cancel <id>` cancels an order before it's picked up:

- a waiting order leaves the line: `Order A6 cancelled`
- an order a courier is riding to frees the courier, who takes the first waiting order if there is one: `Order A4 cancelled, Leo is free`, then `Leo takes A6`
- an order already picked up can't be cancelled: `Ana already has A3, too late to cancel`

An unknown id prints `No order A9`.

## The evening's report

A courier earns 5.00 for each delivery plus 1.00 for every block from the restaurant to the customer. `report` lists the couriers by what they earned, the most first (ties by name), then the average delivery time and the late deliveries:

```text
report
Ana: 1 delivery, 16.00
Dan: 1 delivery, 15.00
Leo: 1 delivery, 10.00
Average delivery: 11.3 min
Late: 1
```

Before any delivery, the average reads `Average delivery: none`. Finally, check that the program never stops with an exception: commands with the wrong number of words print their usage line (`Usage: order <id> <rx> <ry> <cx> <cy>`, `Usage: tick <minutes>`, `Usage: cancel <id>`), and a corner or a number of minutes that isn't a number prints `Not a number: soon`.
