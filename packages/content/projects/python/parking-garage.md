The garage under the town hall still runs on paper tickets, and the attendant, Mr. Ilie, adds up the fees with a calculator at the end of the day. The town wants a program he can type the cars into as they come and go: it knows how many spaces are free, charges each car by its stay and tells him at closing time what came in.

You build it one step at a time, in one file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## Open the garage

The first line is how many spaces the garage has. Print `Garage open with 20 spaces` (with the real number), then keep reading commands, one per line, until Mr. Ilie types `close`, and print `Closed` then. Every other command can be ignored for now.

Times in every command are written `HH:MM` on a 24-hour clock, like `08:15` or `17:40`, all on the same day. Turning one into minutes since midnight (`08:15` is 495) makes every later calculation easy, so write a function for it now.

## A car comes in

`in <plate> <time>` parks a car and says how many spaces are left:

```text
in B-123-XYZ 08:15
B-123-XYZ parked at 08:15, 19 spaces left
```

With one left it reads `1 space left`. Refuse the car, and change nothing, when:

- that plate is already inside: `B-123-XYZ is already inside`
- every space is taken: `Garage full`

Check them in that order.

## A car leaves

`out <plate> <time>` lets a car out and says how long it stayed, in hours and minutes:

```text
out B-123-XYZ 10:45
B-123-XYZ left after 2h 30m
```

A plate that isn't inside prints `IS-01-AAA is not inside`. A leaving time earlier than the arriving time is a typo: print `B-123-XYZ came in at 13:00, check the time` and keep the car inside.

## Fees

Now every car that leaves pays, and the line from the previous step ends with what:

- the first 30 minutes are free
- after that, 5 for every hour started, so 31 minutes cost 5 and 2h 30m costs 15
- no car pays more than 40 for a day

```text
out B-123-XYZ 10:45
B-123-XYZ left after 2h 30m, pays 15
out TM-55-RTA 11:20
TM-55-RTA left after 0h 15m, pays 0
out CJ-07-ANA 19:10
CJ-07-ANA left after 10h 30m, pays 40
```

"Every hour started" is a division that rounds up; `//` rounds down, so think about what to add before dividing.

## Monthly passes

People who work at the town hall buy a monthly pass. `pass <plate>` registers one:

```text
pass B-999-PAS
B-999-PAS has a monthly pass
```

A car with a pass parks like any other and takes a space, but pays nothing when it leaves, and the line says so instead of the fee:

```text
B-999-PAS left after 6h 0m, monthly pass
```

A pass can be registered whether or not the car is inside.

## What's inside

`status` shows how full the garage is, then every car inside, the one that came in first at the top (two that came in at the same minute go by plate):

```text
status
2 of 2 spaces taken
B-123-XYZ since 08:15
CJ-07-ANA since 08:40
```

With the garage empty, only the first line shows: `0 of 20 spaces taken`.

## Closing time

`report` is what Mr. Ilie reads before he locks up:

```text
report
Cars served: 4
Earned: 55
Longest stay: CJ-07-ANA, 10h 30m
```

- **Cars served** counts every car that left, passes included.
- **Earned** adds up the fees paid.
- **Longest stay** is the car that stayed longest of those that left; on a tie, the one that left first. Before any car has left, print `Longest stay: none`.

## Survive bad input

Mr. Ilie types with gloves on in winter. Your program must never stop with an error:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: parkk`
- a known command with the wrong number of words prints how to use it: `Usage: in <plate> <time>`, `Usage: out <plate> <time>`, `Usage: pass <plate>`, `Usage: status`, `Usage: report`
- a time that isn't two digits, a colon and two digits, or isn't a real time (`24:00`, `08:61`), prints `Not a time: 8:15` with the time as typed

Let your time function raise an error for a bad time, and catch it with `try` / `except` where the command is handled.
