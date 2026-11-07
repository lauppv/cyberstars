RoadMate rents out cars, a van and a couple of scooters from a small office near the airport. Each kind is priced differently: cars include a daily allowance of kilometres, the van charges for every kilometre, scooters are cheap but must come back within three days. The staff work it out with a calculator and a printed price sheet. You'll write the office's program, and Java's inheritance does most of the pricing for you.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## The fleet

The program starts by reading the fleet: the first line is how many vehicles, then one line per vehicle with its kind, plate, model and price per day:

```text
5
car B-101-AAA Dacia 120
car B-102-BBB Skoda 160
van B-201-VAN Ford 200
scooter B-301-SCO Vespa 50
scooter B-302-SCO Piaggio 45
```

Write an **abstract** class `Vehicle` with what every vehicle has (plate, model, price per day), and three classes that extend it: `Car`, `Van` and `Scooter`. Each says what kind it is through a method of its own. Keep the vehicles in a `LinkedHashMap` by plate.

Print how many of each kind, `Fleet: 2 cars, 1 van, 2 scooters` (one of a kind has no `s`). Then keep reading commands until someone types `close`, and print `Office closed` then. Any other word prints `Unknown command: drive`.

## What's on the lot

`list` prints every vehicle in the order loaded, with its kind, model, daily price and status:

```text
list
B-101-AAA car Dacia 120.00/day, available
B-102-BBB car Skoda 160.00/day, available
B-201-VAN van Ford 200.00/day, available
B-301-SCO scooter Vespa 50.00/day, available
B-302-SCO scooter Piaggio 45.00/day, available
```

## Rent

`rent <plate> <customer> <day>` hands a vehicle to a customer. Days are numbered from 1:

```text
rent B-101-AAA Ana 3
Ana rents Dacia (B-101-AAA) from day 3
```

`list` now says `rented by Ana` for it. A plate that doesn't exist prints `No vehicle B-999-XXX`, and a vehicle already out `B-101-AAA is rented by Ana`.

## Return and pay

`return <plate> <day> <km>` brings a vehicle back and charges the customer. The rental lasts the days between renting and returning, at least 1, and each kind prices it its own way:

- a **car** costs its daily price per day, and includes 150 km a day; every kilometre beyond that costs 0.25
- a **van** costs its daily price per day plus 0.40 for every kilometre
- a **scooter** costs its daily price per day, plus 20 for every day beyond 3

```text
return B-101-AAA 6 520
Ana returns B-101-AAA after 3 days and 520 km, pays 377.50
```

Declare `price(int days, int km)` as an abstract method in `Vehicle` and write it once in each subclass; the `return` command then calls `price` without asking what kind the vehicle is. That's polymorphism.

A vehicle that isn't out prints `B-301-SCO is not rented`. A return day before the renting day, or negative kilometres, prints `Check the day and the kilometres`.

## What's free

A customer at the desk asks for a scooter. `available <car|van|scooter>` lists the vehicles of that kind that can be rented, cheapest first (then by plate):

```text
available scooter
B-302-SCO Piaggio 45.00/day
B-301-SCO Vespa 50.00/day
```

When none is free, print `No van available`.

## Service

Every vehicle goes to the garage after 1000 km. Keep each vehicle's kilometres since its last service; when a return takes them to 1000 or more, print a second line and take it off the lot:

```text
return B-102-BBB 14 1100
Ana returns B-102-BBB after 4 days and 1100 km, pays 765.00
B-102-BBB has done 1100 km since its service, off to the garage
```

A vehicle in service shows `in service` in `list`, isn't `available`, and can't be rented: `B-102-BBB is in service`. `serviced <plate>` brings it back (`B-102-BBB is back`) with its count at 0; a vehicle that isn't in service prints `B-102-BBB is not in service`.

## Customers

`customer <name>` lists a customer's finished rentals and what they paid in all:

```text
customer Ana
Dacia (B-101-AAA), 3 days, 377.50
Skoda (B-102-BBB), 4 days, 765.00
Total: 1142.50
```

Someone with no finished rental prints `No rentals for Leo`.

## The monthly report

`report` shows what each kind of vehicle earned, the total, and the vehicle rented most often (on a tie, the first in the fleet):

```text
report
cars: 1142.50
vans: 252.00
scooters: 290.00
Total: 1684.50
Most rented: B-101-AAA (1)
```

Before any return, the last line is `Most rented: none`. Finally, check that the program never stops with an exception: a command with the wrong number of words prints its usage line (`Usage: rent <plate> <customer> <day>`, `Usage: return <plate> <day> <km>`, `Usage: available <car|van|scooter>`, `Usage: serviced <plate>`, `Usage: customer <name>`), and a day or a distance that isn't a number prints `Not a number: soon`.
