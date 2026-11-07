Iron Hall is a neighbourhood gym with three kinds of membership and a few group classes a week. The receptionist checks plans by memory, the yoga class gets overbooked, and nobody keeps the waiting list when someone cancels. You'll write the front desk program: members come in and out under their plan's rules, classes fill up and keep a waiting list, and each member's monthly bill adds up by itself.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## Members and plans

The program starts by reading the members: the first line is how many, then one line per member with their name and plan:

```text
4
Ana premium
Dan basic
Ioana student
Leo basic
```

The three plans are an `enum`, each with its monthly fee, whether it lets the member in at any hour, and what a group class costs on it:

| Plan      | Fee | Hours        | A class |
| --------- | --- | ------------ | ------- |
| `BASIC`   | 90  | before 16:00 | 15      |
| `STUDENT` | 70  | before 16:00 | 10      |
| `PREMIUM` | 160 | any time     | 0       |

Make a `Member` class with a name and a plan. Print `Gym with 4 members`, then keep reading commands until the receptionist types `close`, and print `Lights off` then. Any other word prints `Unknown command: run`.

## Coming in

`in <member> <HH:MM>` lets a member in, if their plan allows it at that time:

```text
in Ana 07:30
Welcome, Ana
in Leo 17:10
Basic plans come in before 16:00
```

The plan prints with a capital and the rest small, from a method on the enum. A name that isn't a member prints `No member Mara`, and someone already inside `Ana is already in`. Times are two digits, a colon and two digits; turn them into minutes since midnight.

## Going out

`out <member> <HH:MM>` signs a member out and says how long they trained:

```text
out Ana 08:45
Ana trained 75 min
```

Someone who isn't in prints `Ana is not in`, and a time before they came in `Dan came in later than that`. `who` lists who is in now, sorted by name, `In the gym: Ana, Dan`, or `Nobody is in`.

## Group classes

`class <name> <places>` adds a group class with that many places (`yoga: 2 places`; a name that exists already prints `yoga already exists`). `book <member> <class>` books a place and says what it costs on the member's plan:

```text
book Ana yoga
Ana booked yoga, 0 lei
book Dan yoga
Dan booked yoga, 15 lei
```

When the class is full, the member goes on its waiting list instead, in the order they asked:

```text
book Ioana yoga
yoga is full, Ioana is number 1 on the waiting list
```

Someone already booked or waiting prints `Leo is already on yoga`, and a class that doesn't exist `No class pilates`. A `List` holds the bookings and an `ArrayDeque` makes a fine waiting line.

## Cancelling

`cancel <member> <class>` frees a place. The first on the waiting list gets it at once, and pays for it on their plan; the one who cancelled gets back what they paid:

```text
cancel Ana yoga
Ana cancelled yoga
Ioana moves up from the waiting list
```

Someone on the waiting list can leave it (`Leo left the waiting list for yoga`), and someone on neither prints `Leo is not on yoga`. `roster <class>` shows the bookings in the order they were made and the waiting list, if any:

```text
roster yoga
yoga (2 of 2): Dan, Ioana
Waiting: Leo
```

A class with no booking reads `yoga (0 of 2): nobody`.

## Changing plan

`plan <member> <plan>` moves a member to another plan; from then on its hours and class prices apply:

```text
plan Leo premium
Leo is now on Premium, 160 lei a month
```

A plan that doesn't exist prints `Plans are basic, student and premium`, and the plan they already have `Leo is already on Premium`. A class booked before keeps the price paid for it.

## The monthly bill

`bill <member>` adds up what the member owes this month:

```text
bill Dan
Dan, Basic plan
Membership: 90
Classes: 15
Total: 105
```

## The manager's report

`report` lists every member by visits, the most first (ties by name), with the minutes they trained, then the hour in which most members came in:

```text
report
Ana: 1 visit, 75 min
Dan: 1 visit, 80 min
Leo: 1 visit, 0 min
Ioana: 0 visits, 0 min
Busiest hour: 07:00 (2 in)
```

On a tie the busiest hour is the earliest; with no visit at all it's `Busiest hour: none`. Finally, check that the program never stops with an exception: a command with the wrong number of words prints its usage line (`Usage: in <member> <HH:MM>`, `Usage: class <name> <places>`, and so on for each command), a bad time `Not a time: 25:00`, and a number of places that isn't one `Not a number: many`.
