The town of Sibiu is trying out shared bikes: three stations with docks, a few bikes in each, and riders who take one from any station and leave it at another. For the trial the town needs a program behind it: it knows how many bikes and free docks every station has, prices each ride, sends riders to another station when one is full and reports how the bikes were used.

You build it one step at a time, in one file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## The stations

The program starts by reading the stations: the first line is how many, then one line per station with its name (one word), how many docks it has and how many bikes stand in them:

```text
3
Central 4 3
Park 3 3
Mall 5 1
```

Print `3 stations, 7 bikes` (all the bikes together). Then keep reading commands, one per line, until someone types `quit`, and print `Goodbye` then.

Times are written `HH:MM`, all on the same day; turn them into minutes since midnight with a function of your own.

## Take a bike

`rent <user> <station> <time>` takes a bike out of a station:

```text
rent Ana Central 08:00
Ana took a bike from Central at 08:00
```

Refuse, and change nothing, when:

- there is no station of that name: `No station named Airport`
- the rider already has a bike: `Ana is already riding`
- the station has no bike left: `No bikes at Mall`

Check them in that order.

## Bring it back

`return <user> <station> <time>` leaves the bike in a dock, at any station, and says how long the ride took:

```text
return Ana Mall 08:40
Ana left the bike at Mall after 40 min
```

Refuse, and change nothing, when the station doesn't exist (the same line as `rent`), the rider has no bike, `Leo has no bike`, or the time is before the bike was taken, `Ana took the bike at 10:00, check the time`.

A station whose docks are all taken can't take a bike. Then send the rider to the station with the most free docks (on a tie, the first by name), and keep their bike with them:

```text
return Ana Park 08:25
Park is full, try Mall (5 free docks)
```

If every station is full, print only `Park is full`. Check for a full station after the rider has a bike and before the time.

## The price of a ride

Now every ride that ends is paid for, and the return line ends with the price:

- the first 30 minutes are free
- after that, 1.00 for every 15 minutes started, so 31 minutes cost 1.00 and 46 minutes 2.00

```text
Ana left the bike at Mall after 40 min, pays 1.00
```

## Members

People who ride every day buy a membership. `member <user>` signs one up:

```text
member Dan
Dan is a member now
```

A member rides 45 minutes free, and pays half, 0.50, for every 15 minutes started after that. Dan's 80 minutes: 35 past the free ones make three blocks, `1.50`.

## The stations now

`stations` shows every station, in the order they came at the start, with its bikes and free docks, and says when it's empty or full:

```text
stations
Central: 2 bikes, 2 free docks
Park: 3 bikes, 0 free docks (full)
Mall: 1 bike, 4 free docks
```

The van that moves bikes around town reads this every hour.

## A rider's trips

`trips <user>` lists a rider's finished rides in order, with where from, where to, how long and what it cost, then the total:

```text
trips Ana
Central -> Mall, 40 min, 1.00
Central -> Mall, 62 min, 3.00
Total: 2 trips, 4.00
```

A rider with no finished ride prints `No trips for Leo`. A ride still going doesn't count.

## The trial report

`report` is what the town council reads at the end of the day:

```text
report
Trips: 3
Earned: 5.50
Average trip: 61 min
Busiest station: Central (3 bikes in and out)
Still riding: Ioana
```

- **Trips** counts finished rides, and **Earned** adds up what they cost
- **Average trip** is in whole minutes, rounded; with no trip yet, `Average trip: none`
- **Busiest station** counts every bike taken from it and left at it; on a tie, the first by name
- **Still riding** lists who has a bike now, sorted, separated by commas, or `nobody`

## Survive bad input

Riders type on their phones while walking. Your program must never stop with an error:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: retrun`
- a known command with the wrong number of words prints how to use it: `Usage: rent <user> <station> <time>`, `Usage: return <user> <station> <time>`, `Usage: member <user>`, `Usage: trips <user>`, and `Usage: stations` or `Usage: report` when words follow them
- a time that isn't two digits, a colon and two digits making a real time prints the usage line of its command

Use `try` / `except` where a conversion can fail, rather than checking every character yourself.
