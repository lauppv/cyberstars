Colet Rapid is a small courier company that moves parcels between Romanian towns through its depots. Today a parcel's journey is a column of stamps on a paper slip, and when a customer calls to ask where it is, someone has to go and find the slip. You'll write the tracking system: every parcel gets a status, every scan at a depot moves it on (only in ways that make sense), and anyone can see its whole journey.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## Send a parcel

Print `Tracking ready` at the start. Then keep reading commands until someone types `quit`, and print `Bye` then. Any other word prints `Unknown command: fly`.

`send <id> <from> <to> <kg> <day>` registers a parcel handed in at a town's counter, days counted from 1. The postage goes by weight:

- up to 1 kg: 12.00
- up to 5 kg: 18.00
- up to 10 kg: 25.00
- above 10 kg: 25.00 plus 2.00 for every kilo started beyond 10

```text
send P1 Cluj Iasi 2.5 1
P1: Cluj to Iasi, 2.5 kg, 18.00
```

Refuse, in this order, an id that exists already (`P1 already exists`), a weight that isn't above 0 and at most 30 (`Parcels weigh more than 0 and at most 30 kg`), and a parcel to its own town (`A parcel goes to another town`). Make a `Parcel` class; its constructor can work out the postage.

## Statuses

A parcel is always in exactly one state, which makes an `enum`: `REGISTERED`, `IN_TRANSIT`, `AT_DEPOT`, `OUT_FOR_DELIVERY`, `DELIVERED` and `RETURNED`. Give each the words it prints: `registered`, `in transit`, `at the depot`, `out for delivery`, `delivered`, `returned to sender`.

Each parcel also knows the town it's in, starting with its `from` town, and keeps a history: a list of lines like `Day 1: registered in Cluj`, one added every time something happens to it.

## Scans

Every time a parcel is handled, it's scanned: `scan <id> <event> <day> [place]`. Each event is allowed only from certain states:

| Event            | Allowed when                    | Becomes                    | Prints                   |
| ---------------- | ------------------------------- | -------------------------- | ------------------------ |
| `leave`          | registered or at a depot        | in transit                 | `P1 left Cluj`           |
| `arrive <place>` | in transit                      | at the depot in that place | `P1 arrived in Sibiu`    |
| `out`            | at the depot of its destination | out for delivery           | `P1 is out for delivery` |
| `deliver`        | out for delivery                | delivered                  | `P1 delivered on day 4`  |

An event that isn't allowed changes nothing and says why, naming what it couldn't do:

```text
scan P1 out 2
P1 is at the depot in Sibiu, it can't go out for delivery
```

The other phrases are `leave`, `arrive` and `be delivered`. An event that isn't one of these prints `Events are leave, arrive, out, deliver and fail`, and a parcel that doesn't exist `No parcel P9`. A `switch` on the event, checking the current status, keeps the rules in one place. Every scan that goes through adds its line to the history: `left Cluj`, `arrived in Sibiu`, `out for delivery`, `delivered`.

## Track

`track <id>` answers the customer on the phone: the status, then the history, indented by two spaces:

```text
track P1
P1 is delivered
  Day 1: registered in Cluj
  Day 1: left Cluj
  Day 2: arrived in Sibiu
  Day 2: left Sibiu
  Day 3: arrived in Iasi
  Day 3: out for delivery
  Day 3: nobody home
  Day 4: out for delivery
  Day 4: delivered
```

## Nobody home

`fail` is a delivery attempt with nobody home, allowed only when the parcel is out for delivery. It goes back to the depot for another try (history: `nobody home`):

```text
scan P2 fail 2
P2: nobody home, attempt 1 of 3
```

On the third failed attempt it goes back to its sender instead, for good, and its history says `third failed delivery, returned to sender`:

```text
scan P2 fail 4
P2: third failed delivery, back to Cluj
```

The phrase for a refused `fail` is `miss a delivery`.

## What's at the depot

`depot <town>` lists the parcels waiting in a town, registered there or at its depot, sorted by id:

```text
depot Cluj
Cluj: P1, P2
```

With none, print `Nothing in Cluj`.

## Late parcels and the report

The company promises delivery within 3 days. `late <day>` lists, in the order they were sent, the parcels neither delivered nor returned that were sent more than 3 days before that day, with their status, or prints `Nothing late on day 7`:

```text
late 7
P3 sent on day 2, registered
```

`report` counts the parcels in each status that has any (in the enum's order), adds up the postage, and gives the average days from sending to delivery of the delivered ones:

```text
report
registered: 1
delivered: 1
returned to sender: 1
Postage: 63.00
Average delivery: 3.0 days
```

With nothing delivered, the last line is `Average delivery: none`. An `EnumMap` counts by status in the enum's order. Finally, check that the program never stops with an exception: commands with the wrong number of words print their usage line (`Usage: send <id> <from> <to> <kg> <day>`, `Usage: scan <id> <event> <day> [place]`, `Usage: scan <id> arrive <day> <place>` when `arrive` has no place, `Usage: track <id>`, `Usage: depot <town>`, `Usage: late <day>`), and a weight or day that isn't a number `Not a number: heavy`.
