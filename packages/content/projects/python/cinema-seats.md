The small cinema in the old cultural centre sells tickets at a window, and the cashier keeps track of the seats by crossing them off on a printed plan. On busy nights two people end up with the same seat. You'll write the program behind the window: a map of the hall that shows what's free, bookings and cancellations, and help finding good seats for a group.

You build it one step at a time, in one file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## Build the hall

The first line gives the hall's size: how many rows, then how many seats in each row, like `5 8`. Rows are named by letters from `A` (the one nearest the screen), seats by numbers from 1, so the first seat is `A1` and the last of that hall `E8`.

Keep the hall as a list of rows, each a list of seats that are either free or sold: a list of lists. Print `Hall ready: 40 seats`, then keep reading commands until the cashier types `quit`, and print `Goodbye` then.

## The map

`map` draws the hall, a line per row: the row's letter, two spaces, then a `.` for each free seat and an `X` for each sold one. Above the rows, a line numbers the seats, under the seats they name; past 9 it shows only the last digit, so it stays one character a seat:

```text
map
   12345678
A  ..XX....
B  ........
C  ...XXX..
D  ........
E  ........
```

Nothing is sold yet when you first try it, so every seat is a `.`.

## Book seats

`book <seat> <seat> ...` sells one or more seats. Seats in front, rows `A` and `B`, cost 8.00; every other row 12.00. Say what was booked, in the order typed, how many tickets and the total:

```text
book A3 A4
Booked A3, A4, 2 tickets, 16.00
book C4 C5 C6
Booked C4, C5, C6, 3 tickets, 36.00
```

A single seat reads `1 ticket`. A booking is all or nothing: when one of its seats can't be sold, none is, and the program prints the first problem, going through the seats in order:

- a seat outside the hall, or that isn't a letter followed by a number: `Z9 is not a seat`
- a seat that's sold: `C6 is taken`
- the same seat named twice: `B2 is there twice`

Letters can be typed small: `a1` is `A1`, and the answers always show capitals.

## Cancel

`cancel <seat> <seat> ...` gives seats back, all or nothing like a booking, and says what's refunded:

```text
cancel A4
Cancelled A4, refund 8.00
```

A seat that isn't sold prints `A4 was not booked`; a seat that doesn't exist, or named twice, gets the same messages as in `book`.

## The best seats together

A family of four wants to sit together, in a good spot. `best <count>` finds that many free seats side by side in one row, without booking them:

```text
best 3
Best 3 together: C1, C2, C3
```

Good means near the middle of the hall:

- the row nearest the middle row wins (in a hall of 5 rows that's `C`, then `B` and `D`); between two equally near, the one in front
- in that row, the seats whose middle is nearest the middle of the row win; between two equally near, the ones further left

When no row has that many free seats together, print `No 5 seats together`.

Going through every row and every place the group could start, and keeping the best one found so far, is enough: a cinema hall is small.

## Book a group

`group <count>` books what `best` would suggest, priced and printed like `book`:

```text
group 4
Booked B3, B4, B5, B6, 4 tickets, 32.00
```

When there's no room, it prints the same `No 4 seats together` and books nothing.

## How full is it

`stats` is what the manager asks for before the film starts:

```text
stats
Sold: 8 of 40 (20% full)
Earned: 76.00
Fullest row: B (4 of 8)
```

- the percentage is rounded down to a whole number
- **Earned** is what the bookings brought in, minus the refunds
- **Fullest row** is the row with the most seats sold (on a tie, the one in front); with nothing sold, `Fullest row: none`

## Survive bad input

On busy nights the cashier types fast. Your program must never stop with an error:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: mapp`
- `book` or `cancel` without a seat prints `Usage: book <seat> ...` or `Usage: cancel <seat> ...`
- `best` or `group` without exactly one count, or with one that isn't a whole number of at least 1, prints `Usage: best <count>` or `Usage: group <count>`
- `map` or `stats` with words after them prints `Usage: map` or `Usage: stats`
