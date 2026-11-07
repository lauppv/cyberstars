Tram line 1 runs from the depot, through the station and the centre, to the university campus and back, all day long, every few minutes. The city wants a small program for the screens at its stops: when the next tram comes in each direction, how long a trip takes, and the printed timetable glued to every pole. All of it follows from a few numbers, and you'll work it out in C.

You build it one step at a time, in one C file. Every step adds a command, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is. Run it, then type the lines of an example yourself to see what it answers.

## The line

The program starts by reading the line: how many stops (at most 30), then each stop with how many minutes a tram takes from the first stop to get there, then the first tram's departure, the last tram's departure and how many minutes apart they leave:

```text
5
Depou 0
Gara 4
Centru 9
Spital 15
Campus 20
05:30
22:30
10
```

Trams leave the first stop at 05:30, 05:40, 05:50 and so on, the last one at 22:30. Read the times with `scanf("%d:%d", ...)` and keep them as minutes since midnight. Print a summary:

```text
Line from Depou to Campus, 5 stops, 20 min end to end
```

Then keep reading commands until someone types `quit`, and print `Bye` then. Any other word prints `Unknown command: fly`, and the rest of its line is skipped with `scanf("%*[^\n]")`.

## The next tram

`next <stop> <HH:MM>` shows the next tram towards `Campus` at that stop: the first tram whose arrival there is at that time or later. A tram that left the first stop at `start` is at a stop at `start` plus that stop's minutes.

```text
next Gara 08:13
To Campus: 08:14 (in 1 min)
```

When the day's last tram has gone, print `To Campus: no more trams today`. An unknown stop prints `No stop Mall`.

## Both directions

Trams also run back: from `Campus` to `Depou`, leaving `Campus` at the same times trams leave `Depou`, and stopping at the same stops in reverse. Going back, a stop is as many minutes from `Campus` as the whole line takes minus its minutes from `Depou`: `Gara` is 20 - 4 = 16 minutes from `Campus`.

`next` now shows both directions, towards `Campus` first:

```text
next Gara 08:13
To Campus: 08:14 (in 1 min)
To Depou: 08:16 (in 3 min)
```

At the two ends there's only one direction: at `Campus`, only `To Depou`, and at `Depou`, only `To Campus`. A function that gives a stop's minutes from the start of its run in either direction keeps this short.

## Plan a trip

`trip <from> <to> <HH:MM>` takes the next tram from one stop in the direction of the other, and says when it leaves, when it arrives and how long the ride is:

```text
trip Gara Spital 08:13
Leave Gara 08:14, arrive Spital 08:25 (11 min)
trip Spital Gara 08:13
Leave Spital 08:15, arrive Gara 08:26 (11 min)
```

The same stop twice prints `You are already there`, a stop that doesn't exist `No stop Mall` (the first one that doesn't), and a trip after the last tram `No more trams today`.

## The timetable on the pole

`timetable <stop>` prints the timetable glued at a stop for the trams towards `Campus` (or towards `Depou` at `Campus` itself): a line per hour, with the minutes of every tram in that hour:

```text
timetable Spital
Spital, to Campus
05 | 45 55
06 | 05 15 25 35 45 55
07 | 05 15 25 35 45 55
...
22 | 05 15 25 35 45
```

Every number has two digits (`%02d`). Start a new line whenever a tram's hour differs from the one before it.

## First and last

People ask at the end of the night. `last <stop>` gives the first and the last tram of the day in each direction, in the same order as `next`:

```text
last Gara
To Campus: first 05:34, last 22:34
To Depou: first 05:46, last 22:46
```

The last tram doesn't always leave exactly at the last time given: with trams every 10 minutes from 05:30, a last time of 22:35 still means a last tram at 22:30. Work out the real last departure with a division.

## Survive bad input

Your program must never crash or loop forever:

- a time that isn't hours and minutes, or isn't a real time, prints the usage line of its command, `Usage: next <stop> <HH:MM>` or `Usage: trip <from> <to> <HH:MM>`, and skips the rest of the line
- stop names are read with a width, such as `%31s`, so a long word can't overflow its array
- when the input ends, stop as if `quit` had been typed
