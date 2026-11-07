Pensiunea Brazilor is a small guesthouse in the mountains with four rooms and a big paper calendar behind the reception desk. Twice this year the same room was given to two families for the same weekend. The owners want a booking program instead: it finds a free room of the kind a guest asks for, never gives one out twice, and works out the price, weekends and long stays included.

You build it one step at a time, in one file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## The rooms

The program starts by reading the rooms: the first line is how many, then one line per room with its number, its type and its price for a night:

```text
4
101 single 50
102 single 50
201 double 80
301 suite 150
```

Print `Hotel with 4 rooms`. Then keep reading commands, one per line, until the receptionist types `quit`, and print `Goodbye` then.

Days are numbered from 1, the day the season opens. A guest who stays **from day 3 to day 5** arrives on day 3 and leaves on the morning of day 5: they sleep two nights, 3 and 4, and the room is free again for someone arriving on day 5.

## Book a room

`book <guest> <type> <from> <to>` gives the guest a room of that type, free on every night of the stay. When several are, take the lowest room number. Number the bookings from 1, in the order they're made, and print the price of the stay:

```text
book Ana single 3 5
Booking 1: Ana in room 101, from day 3 to day 5 (2 nights), 100.00
book Dan single 4 6
Booking 2: Dan in room 102, from day 4 to day 6 (2 nights), 110.00
book Ioana single 4 5
No single room free from day 4 to day 5
```

(Dan's price isn't a mistake: the next step explains it.) One night reads `1 night`. Refuse the booking when:

- the stay doesn't end after it starts, or starts before day 1: `A stay ends after it starts, from day 1 on`
- the hotel has no room of that type: `No penthouse rooms here`
- every room of that type is taken on at least one of the nights: the line above

Two stays clash when each starts before the other ends. Write that test as a function: every later step needs it.

## Weekends and long stays

Day 1 is a Monday. A night is named after the day it starts, and the weekend nights are Friday's and Saturday's: days 5 and 6, 12 and 13, and so on. A night is a weekend night when its day divided by 7 leaves 5 or 6.

- a weekend night costs 20% more than the room's price
- a stay of 7 nights or more gets 10% off its whole price

Leo's 8 nights in the double room: six nights at 80.00, two at 96.00, and 10% off, `604.80`.

## The bill

`bill <id>` shows how a booking's price adds up, night by night:

```text
bill 3
Booking 3: Leo, room 201 (double)
Night 1: 80.00
Night 2: 80.00
Night 3: 80.00
Night 4: 80.00
Night 5: 96.00 (weekend)
Night 6: 96.00 (weekend)
Night 7: 80.00
Night 8: 80.00
Long stay: 10% off
Total: 604.80
```

The `Long stay` line only shows on a stay of 7 nights or more. A booking that doesn't exist prints `No booking 9`.

## Cancel

`cancel <id>` removes a booking, and its room is free for those nights again:

```text
cancel 2
Booking 2 cancelled, room 102 is free again
```

A booking that doesn't exist, or was already cancelled, prints `No booking 2`. The ids of the others don't change, and a new booking gets the next number, never one freed by a cancellation.

## Stay longer

Guests who like it want to stay longer. `extend <id> <to>` moves the end of a stay later, in the same room, if that room is free on the extra nights:

```text
extend 1 7
Booking 1 now ends on day 7, 220.00
```

The price is worked out again for the whole stay. Refuse, and change nothing, when the new end isn't later than the current one, `Booking 1 already ends on day 7`, or when another booking has the room on one of the extra nights, `Room 102 is taken before day 7`. A booking that doesn't exist prints `No booking 9`.

## The day at reception

`day <day>` tells the receptionist what happens that day: who arrives, who leaves (each with their room, sorted by room), and how many rooms are taken that night:

```text
day 4
Arriving: Dan (102)
Leaving: nobody
Rooms taken tonight: 3 of 4
```

Several guests are separated by commas, `Arriving: Ana (101), Dan (102)`, and none reads `nobody`.

## What's free

A guest calls to ask what's free. `free <from> <to>` lists every room free on all those nights, by room number, with its type and price:

```text
free 1 3
101 single 50.00
102 single 50.00
301 suite 150.00
```

When nothing is, print `Nothing free from day 1 to day 3`; a stay that doesn't end after it starts gets the same line as `book`.

## Survive bad input

Your program must never stop with an error, whatever is typed at the desk:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: bok`
- a known command with the wrong number of words prints how to use it: `Usage: book <guest> <type> <from> <to>`, `Usage: cancel <id>`, `Usage: bill <id>`, `Usage: extend <id> <to>`, `Usage: day <day>`, `Usage: free <from> <to>`
- a day or an id that isn't a whole number prints the same usage line

Use `try` / `except` where a conversion can fail, rather than checking every character yourself.
