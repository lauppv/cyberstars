RoadMate rents out cars, a van and a couple of scooters from a small office near the airport. Each kind is priced differently: cars include a daily allowance of kilometres, the van charges for every kilometre, scooters are cheap but must come back within three days. The staff work it out with a calculator and a printed price sheet. You'll write the office's program, and Java's inheritance does most of the pricing for you.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests run months at the office your program has never seen. Passing them finishes the project.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## The fleet

The program starts by reading the fleet: the first line is how many vehicles, then one line per vehicle with its kind, plate, model and price per day:

```text
5
car AB-101-AA Honda 120
car AB-102-BB Skoda 160
van AB-201-VN Ford 200
scooter AB-301-SC Vespa 50
scooter AB-302-SC Piaggio 45
```

Write an **abstract** class `Vehicle` with what every vehicle has (plate, model, price per day), and three classes that extend it: `Car`, `Van` and `Scooter`. Each says what kind it is through a method of its own. Keep the vehicles in a `LinkedHashMap` by plate.

Print how many of each kind, `Fleet: 2 cars, 1 van, 2 scooters` (one of a kind has no `s`). Then keep reading commands until someone types `close`, and print `Office closed` then. Any other word prints `Unknown command: drive`.

## What's on the lot

`list` prints every vehicle in the order loaded, with its kind, model, daily price and status:

```text
list
AB-101-AA car Honda 120.00/day, available
AB-102-BB car Skoda 160.00/day, available
AB-201-VN van Ford 200.00/day, available
AB-301-SC scooter Vespa 50.00/day, available
AB-302-SC scooter Piaggio 45.00/day, available
```

## Rent

`rent <plate> <customer> <day>` hands a vehicle to a customer. Days are numbered from 1:

```text
rent AB-101-AA Ida 3
Ida rents Honda (AB-101-AA) from day 3
```

`list` now says `rented by Ida` for it. A plate that doesn't exist prints `No vehicle AB-999-XX`, and a vehicle already out `AB-101-AA is rented by Ida`.

## Return and pay

`return <plate> <day> <km>` brings a vehicle back and charges the customer. The rental lasts the days between renting and returning, at least 1, and each kind prices it its own way:

- a **car** costs its daily price per day, and includes 150 km a day; every kilometre beyond that costs 0.25
- a **van** costs its daily price per day plus 0.40 for every kilometre
- a **scooter** costs its daily price per day, plus 20 for every day beyond 3

```text
return AB-101-AA 6 520
Ida returns AB-101-AA after 3 days and 520 km, pays 377.50
```

Declare `price(int days, int km)` as an abstract method in `Vehicle` and write it once in each subclass; the `return` command then calls `price` without asking what kind the vehicle is. That's polymorphism.

A vehicle that isn't out prints `AB-301-SC is not rented`. A return day before the renting day, or negative kilometres, prints `Check the day and the kilometres`.

## What's free

A customer at the desk asks for a scooter. `available <car|van|scooter>` lists the vehicles of that kind that can be rented, cheapest first (then by plate):

```text
available scooter
AB-302-SC Piaggio 45.00/day
AB-301-SC Vespa 50.00/day
```

When none is free, print `No van available`.

## Service

Every vehicle goes to the garage after 1000 km. Keep each vehicle's kilometres since its last service; when a return takes them to 1000 or more, print a second line and take it off the lot:

```text
return AB-102-BB 14 1100
Ida returns AB-102-BB after 4 days and 1100 km, pays 765.00
AB-102-BB has done 1100 km since its service, off to the garage
```

A vehicle in service shows `in service` in `list`, isn't `available`, and can't be rented: `AB-102-BB is in service`. `serviced <plate>` brings it back (`AB-102-BB is back`) with its count at 0; a vehicle that isn't in service prints `AB-102-BB is not in service`.

## Customers

`customer <name>` lists a customer's finished rentals and what they paid in all:

```text
customer Ida
Honda (AB-101-AA), 3 days, 377.50
Skoda (AB-102-BB), 4 days, 765.00
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
Most rented: AB-101-AA (1)
```

Before any return, the last line is `Most rented: none`. Finally, check that the program never stops with an exception: a command with the wrong number of words prints its usage line (`Usage: rent <plate> <customer> <day>`, `Usage: return <plate> <day> <km>`, `Usage: available <car|van|scooter>`, `Usage: serviced <plate>`, `Usage: customer <name>`), and a day or a distance that isn't a number prints `Not a number: soon`.
