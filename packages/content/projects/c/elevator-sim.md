An office building is replacing its elevator's controller, and before the new one goes in, the engineers want to try its rules on a computer: when to stop, which way to go next, how long people wait. You'll write that simulation: a clock that ticks one second at a time, an elevator that moves one floor a second, and the rule real elevators follow, keep going the way you're going while anyone is waiting ahead.

You build it one step at a time, in one C file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is. Run it, then type the lines of an example yourself to see what it answers.

## The building

The first line is how many floors the building has (at most 50), numbered from 0, the ground floor, where the elevator starts. Print `Building with 10 floors, elevator at floor 0`, then keep reading commands until someone types `quit`, and print `Bye` then. Any other word prints `Unknown command: lift` and skips the rest of its line.

The elevator's whole state fits in a few variables: its floor, its direction (up, down or none), whether its doors are open, the time in seconds, and for every floor whether someone is waiting there. Keep them all together, as globals or in a struct.

## Calls

`call <floor>` is someone pressing the button on a floor (or the floor's number inside the elevator; for this simulation they're the same):

```text
call 3
Call from floor 3
```

Refuse it when:

- the floor isn't in the building: `No floor 12`
- someone already pressed it and is still waiting: `Floor 3 is already waiting`
- the elevator stands there with its doors open: `Doors are open at floor 3`

Remember the second each call came in; the last step needs it.

## Status

`status` describes the elevator now, then the floors with someone waiting, lowest first, or `none`:

```text
status
Floor 3, going up, waiting: 2 5 7
```

The middle part is `doors open`, `going up`, `going down` or `idle`.

## Time passes

`step <seconds>` runs the clock that many seconds, one at a time, and prints a line for each, starting with the second it is. Every second the elevator does exactly one thing, the first that applies:

1. someone is waiting at its floor: it opens its doors, and that floor isn't waiting any more
2. someone is waiting elsewhere: it moves one floor (which way is the next two steps)
3. nobody is waiting: it stands still, idle

```text
call 3
Call from floor 3
step 5
1: floor 1, going up
2: floor 2, going up
3: floor 3, going up
4: floor 3, doors open
5: floor 3, idle
```

Doors open for one second; the next second the elevator leaves (or idles), and they're closed again. Start with one call at a time: move towards the floor that's waiting.

## Which way

With several floors waiting, the elevator follows the rule real ones do:

- going up, it keeps going up as long as anyone waits above it; going down, it keeps going down as long as anyone waits below
- when nobody waits ahead any more, it turns around (if anyone waits behind) or goes idle
- an idle elevator heads for the nearest floor that waits; on a tie, up

So someone pressing the button behind a moving elevator waits until it comes back:

```text
step 2
10: floor 2, going up
11: floor 3, going up
call 2
Call from floor 2
step 13
12: floor 4, going up
13: floor 5, going up
14: floor 5, doors open
15: floor 6, going up
16: floor 7, going up
17: floor 7, doors open
18: floor 6, going down
19: floor 5, going down
20: floor 4, going down
21: floor 3, going down
22: floor 2, going down
23: floor 2, doors open
24: floor 2, idle
```

Floors 5 and 7 were waiting above when floor 2 called. Two small functions, "anyone waiting above?" and "anyone waiting below?", make this rule a handful of `if`s.

## Stops on the way

Every floor the elevator passes is checked, not only the one it's heading for: on its way from 0 to 7 it stops at 5 if 5 is waiting, and the doors open there for a second before it goes on, as in the example above. If your elevator already does this because of how you wrote rule 1, tick this step off: it's the point of keeping a list of waiting floors rather than a single target.

## The engineers' report

`report` sums up the simulation so far:

```text
report
Time: 24 s
Floors travelled: 16
Stops: 5
Average wait: 7.0 s, longest 12 s
```

- **Floors travelled** counts every one-floor move
- **Stops** counts every time the doors opened
- a call's **wait** is from the second it came in to the second the doors opened at its floor; the average has one decimal, and before any doors opened it's `Average wait: none`

The engineers will now change the rule (say, always go to the nearest waiting floor) and compare the reports.

## Survive bad input

Your program must never crash or loop forever:

- `call` whose floor isn't a number prints `Usage: call <floor>` and skips the rest of the line
- `step` whose seconds aren't a whole number of at least 1 prints `Usage: step <seconds>` and skips the rest of the line
- when the input ends, stop as if `quit` had been typed
