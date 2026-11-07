A small regional airline flies propeller planes between Bucharest and the mountains, and its check-in desk still uses a paper seat plan and a pen. You'll write the desk's program for one flight: passengers check in with their booking code, choose a seat on a map, drop their bags (and pay when they're heavy), and when the gate opens the program calls them to board in an order that fills the plane fastest.

You build it one step at a time, in one C file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is. Run it, then type the lines of an example yourself to see what it answers.

## The flight

The program starts by reading the flight: its number, how many rows of seats it has (at most 40) and how many passengers booked (at most 200), then one line per booking with its six-character code and the passenger's surname:

```text
RO341 4 5
K7Q2LM Popescu
P9X4AB Ionescu
Z3T8CD Marin
B2W6EF Stan
H5N1GH Dobre
```

Print `Flight RO341: 4 rows, 5 passengers`. Then keep reading commands until the agent types `close`, and print `Check-in closed` then. Any other word prints `Unknown command: fly`, and the rest of its line is skipped with `scanf("%*[^\n]")`.

## Check in

`checkin <code> <surname>` checks a passenger in, once the surname matches the booking:

```text
checkin K7Q2LM Popescu
Welcome, Popescu
```

Refuse when:

- there's no booking with that code: `No booking AAAAAA`
- the surname is a different one: `Booking P9X4AB is not under Popa`
- the passenger is already checked in: `Popescu is already checked in`

## Choose a seat

Every row has six seats, `A` to `F`, with the aisle between `C` and `D`. A seat is named by its row and letter, like `3A` or `12F`; `scanf("%d%c", &row, &letter)` reads one.

`seat <code> <seat>` gives a checked-in passenger a seat:

```text
seat K7Q2LM 3A
Popescu in 3A
```

A passenger who asks again moves: their old seat is free again. Refuse, in this order, when:

- the seat isn't on this plane (a row outside the plane, a letter other than A to F): `No such seat`
- the booking doesn't exist: `No booking ZZZZZZ`
- the passenger isn't checked in: `Stan must check in first`
- someone else sits there: `3A is taken`

A two-dimensional array, a row of six for every row of the plane, is a natural way to know which seats are taken.

## The seat map

`map` draws the plane, a line per row: the row's number in two characters (`%2d`), a space, then each seat's letter, or `X` when it's taken, with a space for the aisle:

```text
map
 1 ABC DEX
 2 ABC DEF
 3 XBX DEF
 4 ABC DEF
```

## Bags

`bag <code> <kg>` drops a checked bag. Every passenger has one bag included, and the airline's rules are:

- a second bag costs 50
- a bag over 23 kg costs 30 more
- a bag over 32 kg doesn't go in the hold: `Bags over 32 kg travel as cargo`
- no more than 2 bags each: `Popescu already has 2 bags`

```text
bag K7Q2LM 20
Bag 1 for Popescu, 20 kg, fee 0
bag K7Q2LM 25
Bag 2 for Popescu, 25 kg, fee 80
```

An unknown booking or one not checked in gets the same lines as `seat`. Keep each passenger's bags, kilos and fees.

## Boarding order

When the gate opens, `boarding` lists everyone with a seat in the order they're called: the back row first, and in each row the window seats (`A` then `F`) before the middle (`B`, `E`) and the aisle (`C`, `D`). That way nobody blocks someone who sits further in.

```text
boarding
3A Popescu
3C Ionescu
1F Marin
```

With no seat taken yet, print `Nobody has a seat yet`.

## The desk report

`report` is what the agent sends to the gate:

```text
report
Checked in: 3 of 5
With a seat: 3
Bags: 2, 45 kg
Fees: 80
Not checked in: Stan Dobre
```

The last line lists the passengers not checked in, in the order they booked, or says `nobody`.

## Survive bad input

The queue is long and the agent types fast. Your program must never crash or loop forever:

- a seat that doesn't read as a number and a letter prints `No such seat`, and the rest of the line is skipped
- `bag` with a weight that isn't a whole number of at least 1 prints `Usage: bag <code> <kg>`, and the rest of the line is skipped
- codes and names are read with a width, such as `%7s` and `%31s`, so a long word can't overflow its array
- when the input ends, stop as if `close` had been typed
