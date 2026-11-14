Swift Parcel is a small company that carries parcels between towns in Europe, through its depots. Today the journey of a parcel is a list of stamps on a piece of paper. When a customer calls to ask where their parcel is, someone has to go and find the paper. You will write the tracking program in Java. Every parcel has a status, every scan at a depot moves it on (only in ways that make sense), and anyone can see its whole journey.

**How it works.** The program reads commands and answers each one at once. Here is a session as you see it in the output box when you run a finished program. Each command you type is followed by the answer:

```text
Tracking ready
send A1 Graz Pisa 10 3
A1: Graz to Pisa, 10 kg, 25.00
send A2 Pisa Graz 10.5 3
A2: Pisa to Graz, 10.5 kg, 27.00
scan A1 leave 3
A1 left Graz
scan A1 arrive 4 Pisa
A1 arrived in Pisa
scan A1 leave 4
A1 left Pisa
scan A1 arrive 5 Graz
A1 arrived in Graz
scan A1 out 5
A1 is at the depot in Graz, it can't go out for delivery
scan A1 leave 5
A1 left Graz
scan A1 arrive 6 Pisa
A1 arrived in Pisa
scan A1 out 6
A1 is out for delivery
scan A1 deliver 6
A1 delivered on day 6
track A1
A1 is delivered
  Day 3: registered in Graz
  Day 3: left Graz
  Day 4: arrived in Pisa
  Day 4: left Pisa
  Day 5: arrived in Graz
  Day 5: left Graz
  Day 6: arrived in Pisa
  Day 6: out for delivery
  Day 6: delivered
scan A1 fail 7
A1 is delivered, it can't miss a delivery
depot Pisa
Pisa: A2
late 6
Nothing late on day 6
late 8
A2 sent on day 3, registered
report
registered: 1
delivered: 1
Postage: 52.00
Average delivery: 3.0 days
quit
Bye
```

The commands:

| Command                            | What it does                                      |
| ---------------------------------- | ------------------------------------------------- |
| `send <id> <from> <to> <kg> <day>` | a customer sends a parcel                         |
| `scan <id> <event> <day> [place]`  | a worker scans a parcel: something happened to it |
| `track <id>`                       | the parcel's status and its whole journey         |
| `depot <town>`                     | the parcels that wait in a town                   |
| `late <day>`                       | the parcels that are late on that day             |
| `report`                           | numbers about all the parcels                     |
| `quit`                             | ends the program                                  |

Some words you will meet:

| Word    | What it means                                                         |
| ------- | --------------------------------------------------------------------- |
| depot   | a building in a town where parcels wait between journeys              |
| postage | the price of sending a parcel                                         |
| status  | where the parcel is in its journey: registered, in transit, and so on |
| scan    | a worker reads the parcel's code when something happens to it         |

**To try your program**, press Run, then type or paste the commands in the output box. `quit` ends the program.

Build the program one step at a time, in one `Main.java`. Each step adds a command or a rule, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests send other parcels. Passing them finishes the project.

## Send a parcel

Read every line with a `Scanner` (`nextLine()`) and split it into words. Print `Tracking ready` at the start. Then read commands until someone types `quit`, and print `Bye` then. For any other word, print `Unknown command: fly`.

`send <id> <from> <to> <kg> <day>` registers a parcel that a customer brings to the counter in a town. Days are numbers, from 1. The postage depends on the weight:

| Weight          | Postage                                                    |
| --------------- | ---------------------------------------------------------- |
| up to 1 kg      | 12.00                                                      |
| up to 5 kg      | 18.00                                                      |
| up to 10 kg     | 25.00                                                      |
| more than 10 kg | 25.00, plus 2.00 for every kilo or part of a kilo after 10 |

```text
send P1 Lyon Bern 2.5 1
P1: Lyon to Bern, 2.5 kg, 18.00
```

Say no, in this order, when:

- the id is already used: `P1 already exists`
- the weight is not above 0 and at most 30: `Parcels weigh more than 0 and at most 30 kg`
- the parcel goes to its own town: `A parcel goes to another town`

Make a class `Parcel`. Its constructor can work out the postage.

## Statuses

A parcel always has exactly one status, so the statuses make an `enum`: `REGISTERED`, `IN_TRANSIT`, `AT_DEPOT`, `OUT_FOR_DELIVERY`, `DELIVERED` and `RETURNED`. Give each one the words it prints: `registered`, `in transit`, `at the depot`, `out for delivery`, `delivered`, `returned to sender`.

Each parcel also knows the town it is in, at first its `from` town. And it keeps a history: a list of lines like `Day 1: registered in Lyon`, with a new line every time something happens to it.

## Scans

Every time someone handles a parcel, they scan it: `scan <id> <event> <day> [place]`. Each event is allowed only from some statuses:

| Event            | Allowed when                    | Becomes                    | Prints                   |
| ---------------- | ------------------------------- | -------------------------- | ------------------------ |
| `leave`          | registered or at a depot        | in transit                 | `P1 left Lyon`           |
| `arrive <place>` | in transit                      | at the depot in that place | `P1 arrived in Porto`    |
| `out`            | at the depot of its destination | out for delivery           | `P1 is out for delivery` |
| `deliver`        | out for delivery                | delivered                  | `P1 delivered on day 4`  |

An event that is not allowed changes nothing, and says why, with what it couldn't do:

```text
scan P1 out 2
P1 is at the depot in Porto, it can't go out for delivery
```

For the other events, the words are `leave`, `arrive` and `be delivered`. For an event that is not one of these, print `Events are leave, arrive, out, deliver and fail`. For a parcel that doesn't exist, print `No parcel P9`.

A `switch` on the event, which checks the status, keeps all the rules in one place. Every scan that works adds its line to the history: `left Lyon`, `arrived in Porto`, `out for delivery`, `delivered`.

## Track

`track <id>` answers the customer on the phone: the status, then the history, with two spaces in front of each line:

```text
track P1
P1 is delivered
  Day 1: registered in Lyon
  Day 1: left Lyon
  Day 2: arrived in Porto
  Day 2: left Porto
  Day 3: arrived in Bern
  Day 3: out for delivery
  Day 3: nobody home
  Day 4: out for delivery
  Day 4: delivered
```

## Nobody home

`fail` means the driver tried to deliver the parcel, but nobody was at home. It is allowed only when the parcel is out for delivery. The parcel goes back to the depot, to try again another day, and its history says `nobody home`:

```text
scan P2 fail 2
P2: nobody home, attempt 1 of 3
```

The third time, it goes back to the person who sent it, for good, and its history says `third failed delivery, returned to sender`:

```text
scan P2 fail 4
P2: third failed delivery, back to Lyon
```

When a `fail` is not allowed, the words are `miss a delivery`.

## What's at the depot

`depot <town>` lists the parcels that wait in a town, registered there or at its depot, sorted by id:

```text
depot Lyon
Lyon: P1, P2
```

When none wait, print `Nothing in Lyon`.

## Late parcels and the report

The company promises to deliver in 3 days. `late <day>` lists the parcels that are not delivered or returned and were sent more than 3 days before that day, in the order they were sent, with their status:

```text
late 7
P3 sent on day 2, registered
```

When none are late, print `Nothing late on day 7`.

`report` counts the parcels of each status that has any (in the enum's order), adds up the postage, and gives the average number of days from sending to delivery, for the delivered parcels:

```text
report
registered: 1
delivered: 1
returned to sender: 1
Postage: 63.00
Average delivery: 3.0 days
```

With nothing delivered, the last line is `Average delivery: none`. An `EnumMap` counts by status, in the enum's order.

Last, make sure the program never stops with an exception:

- a command with the wrong number of words prints how to use it: `Usage: send <id> <from> <to> <kg> <day>`, `Usage: scan <id> <event> <day> [place]`, `Usage: scan <id> arrive <day> <place>` (when `arrive` has no place), `Usage: track <id>`, `Usage: depot <town>` or `Usage: late <day>`
- a weight or a day that is not a number prints `Not a number: heavy`
