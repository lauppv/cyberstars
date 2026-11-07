Bubbles is a self-service laundromat near the student dorms: washers, a dryer, and prepaid cards customers top up at the counter. The owner, Mrs. Lungu, wants a program on the counter's computer that starts the machines, knows when each one finishes, notices laundry left inside and tells her at night what each machine earned.

You build it one step at a time, in one C file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is. Run it, then type the lines of an example yourself to see what it answers.

## The machines

The program starts by reading the machines: the first line is how many (at most 10), then one line per machine with its id, its kind, how many minutes a cycle takes and what it costs, in bani:

```text
4
W1 washer 40 1200
W2 washer 40 1200
W3 washer 60 1500
D1 dryer 30 800
```

Keep them in an array of structs; later steps add fields to it. Print `4 machines ready`, then keep reading commands until Mrs. Lungu types `quit`, and print `Closed` then. Any other word prints `Unknown command: spin`, and the rest of that line is skipped: `scanf("%*[^\n]")` reads and throws away everything up to the end of the line.

## Prepaid cards

Customers pay with a card named after them. `card <name> <amount>` tops one up, in bani, opening it the first time:

```text
card Ana 2000
Ana has 20.00 on the card
card Ana 1000
Ana has 30.00 on the card
```

Keep the cards in a second array of structs (at most 50).

## Start a machine

`start <machine> <name> <HH:MM>` starts a cycle for a customer and charges their card. Read the time with `scanf("%d:%d", ...)` and keep it as minutes since midnight:

```text
start W1 Ana 09:00
W1 started for Ana, done at 09:40
```

Refuse, and charge nothing, when:

- there is no such machine: `No machine W9`
- the machine is still running: `W1 is busy until 09:40`
- the card doesn't cover the price, or there is no card of that name: `Dan has 10.00 on the card, W2 costs 12.00`

Check them in that order.

## What's running

`status <HH:MM>` shows every machine, in the order loaded, with its kind and what it's doing at that time:

```text
status 09:25
W1 washer: Ana, 15 min left
W2 washer: free
W3 washer: free
D1 dryer: free
```

## Collecting the laundry

A finished machine isn't free until its customer takes their laundry out. `status` shows it as `W1 washer: done, waiting for Ana`, and starting it again is refused: `W1 still has Ana's laundry in it` (check this right after the busy rule).

`collect <machine> <HH:MM>` empties a machine:

```text
collect W1 09:50
Ana collected from W1
```

A machine still running prints `W1 is still running, 10 min left`, an empty one `W1 is empty`, and an unknown one `No machine W9`.

## Out of order

Machines break. `broken <machine>` takes one out of service and `fixed <machine>` brings it back:

```text
broken W2
W2 is out of order
fixed W2
W2 works again
```

A machine out of order can't be started (`W2 is out of order`, checked right after the machine exists), and `status` shows it as `W2 washer: out of order`. A machine with laundry in it can't be marked broken: `W1 has Ana's laundry in it, collect it first`.

## The night report

`report` shows every machine's cycles and what they brought in, then the total and the busiest machine:

```text
report
W1: 1 use, 12.00
W2: 0 uses, 0.00
W3: 0 uses, 0.00
D1: 1 use, 8.00
Earned: 20.00
Busiest: W1
```

On a tie the busiest is the first in the list; when nothing ran it's `Busiest: none`.

## Survive bad input

Customers queue up and Mrs. Lungu types fast. Your program must never crash or loop forever:

- `card` without a name and a whole amount above 0 prints `Usage: card <name> <amount>`
- `start`, `status` or `collect` with a time that isn't hours and minutes (`25:00`, `ten`) print `Usage: start <machine> <name> <HH:MM>`, `Usage: status <HH:MM>` or `Usage: collect <machine> <HH:MM>`
- every name and id is read with a width, such as `%31s`, so a long word can't overflow its array
- when the input ends, stop as if `quit` had been typed: `scanf` then returns `EOF`

Writing a `read_time` function that returns whether it read a real time keeps the three commands short.
