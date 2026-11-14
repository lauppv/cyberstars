RoadMate rents out cars, a van and two scooters from a small office near the airport. Each kind has its own price: a car includes some kilometres each day, the van costs something for every kilometre, and scooters are cheap but must come back within three days. Today the staff work it all out with a calculator and a printed list of prices. You will write the office's program in Java, and inheritance does most of the pricing for you.

**How it works.** The program first reads the vehicles, then commands, and answers each command at once. Here is a session as you see it in the output box when you run a finished program. The lines you type are followed by the program's answers:

```text
3
car CD-1 Polo 100
van CD-2 Transit 150
scooter CD-3 Vespa 40
Fleet: 1 car, 1 van, 1 scooter
rent CD-3 Ida 1
Ida rents Vespa (CD-3) from day 1
return CD-3 3 10
Ida returns CD-3 after 2 days and 10 km, pays 80.00
rent CD-3 Ida 5
Ida rents Vespa (CD-3) from day 5
return CD-3 5 0
Ida returns CD-3 after 1 day and 0 km, pays 40.00
rent CD-2 Dan 2
Dan rents Transit (CD-2) from day 2
return CD-2 1 10
Check the day and the kilometres
return CD-2 2 2600
Dan returns CD-2 after 1 day and 2600 km, pays 1190.00
CD-2 has done 2600 km since its service, off to the garage
list
CD-1 car Polo 100.00/day, available
CD-2 van Transit 150.00/day, in service
CD-3 scooter Vespa 40.00/day, available
rent CD-2 Eva 3
CD-2 is in service
serviced CD-2
CD-2 is back
rent CD-1 Eva 10
Eva rents Polo (CD-1) from day 10
return CD-1 11 150
Eva returns CD-1 after 1 day and 150 km, pays 100.00
return CD-1 11 0
CD-1 is not rented
customer Ida
Vespa (CD-3), 2 days, 80.00
Vespa (CD-3), 1 day, 40.00
Total: 120.00
customer Dan
Transit (CD-2), 1 day, 1190.00
Total: 1190.00
available van
CD-2 Transit 150.00/day
available car
CD-1 Polo 100.00/day
report
cars: 100.00
vans: 1190.00
scooters: 120.00
Total: 1410.00
Most rented: CD-3 (2)
close
Office closed
```

The commands:

| Command                         | What it does                              |
| ------------------------------- | ----------------------------------------- |
| `list`                          | shows every vehicle and if it is free     |
| `rent <plate> <customer> <day>` | a customer takes a vehicle                |
| `return <plate> <day> <km>`     | a customer brings a vehicle back and pays |
| `available <car\|van\|scooter>` | the free vehicles of one kind             |
| `serviced <plate>`              | a vehicle comes back from the garage      |
| `customer <name>`               | what a customer rented and paid           |
| `report`                        | what the office earned                    |
| `close`                         | ends the program                          |

Some words you will meet:

| Word        | What it means                                                                                |
| ----------- | -------------------------------------------------------------------------------------------- |
| fleet       | all the vehicles of the office                                                               |
| plate       | the number on a vehicle, like `CD-1`: each vehicle has its own                               |
| service     | a visit to the garage, to check the vehicle                                                  |
| inheritance | a class that extends another one gets everything the other has, and can add or change things |

**To try your program**, press Run, then type or paste the lines in the output box. `close` ends the program.

Build the program one step at a time, in one `Main.java`. Each step adds a command or a rule, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests play other months at the office. Passing them finishes the project.

## The fleet

Read every line with a `Scanner` (`nextLine()`) and split it into words. The program first reads the fleet. The first line is how many vehicles there are. Then comes one line for each vehicle: its kind, its plate, its model and its price for one day:

```text
5
car AB-101-AA Honda 120
car AB-102-BB Skoda 160
van AB-201-VN Ford 200
scooter AB-301-SC Vespa 50
scooter AB-302-SC Piaggio 45
```

Write an **abstract** class `Vehicle` with what every vehicle has (plate, model, price for a day), and three classes that extend it: `Car`, `Van` and `Scooter`. Each one says what kind it is with a method of its own. Keep the vehicles in a `LinkedHashMap`, with the plate as the key.

Print how many of each kind there are: `Fleet: 2 cars, 1 van, 2 scooters` (with one, no `s`). Then read commands until someone types `close`, and print `Office closed` then. For any other word, print `Unknown command: drive`.

## List the vehicles

`list` prints every vehicle in the order it was read, with its kind, its model, its price for a day and if it is free:

```text
list
AB-101-AA car Honda 120.00/day, available
AB-102-BB car Skoda 160.00/day, available
AB-201-VN van Ford 200.00/day, available
AB-301-SC scooter Vespa 50.00/day, available
AB-302-SC scooter Piaggio 45.00/day, available
```

## Rent

`rent <plate> <customer> <day>` gives a vehicle to a customer. Days are numbers, from 1:

```text
rent AB-101-AA Ida 3
Ida rents Honda (AB-101-AA) from day 3
```

Now `list` says `rented by Ida` for it. For a plate that is not in the fleet, print `No vehicle AB-999-XX`. For a vehicle someone already has, print `AB-101-AA is rented by Ida`.

## Return and pay

`return <plate> <day> <km>` brings a vehicle back, and the customer pays. The rental lasts the days from renting to returning, at least 1. Each kind has its own price:

| Kind    | Price                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------ |
| car     | its price for a day, for each day. 150 km a day are included, and each kilometre more costs 0.25 |
| van     | its price for a day, for each day, plus 0.40 for every kilometre                                 |
| scooter | its price for a day, for each day, plus 20 for every day after the third                         |

```text
return AB-101-AA 6 520
Ida returns AB-101-AA after 3 days and 520 km, pays 377.50
```

Here: 3 days × 120 = 360, and 3 days include 450 km, so the 70 km more cost 17.50.

Write `price(int days, int km)` as an abstract method in `Vehicle`, and write it once in each class that extends it. Then the `return` command calls `price` without asking what kind the vehicle is: Java calls the right one. This is called polymorphism.

For a vehicle nobody has, print `AB-301-SC is not rented`. For a return day before the rent day, or negative kilometres, print `Check the day and the kilometres`.

## What's free

A customer at the desk asks for a scooter. `available <car|van|scooter>` lists the vehicles of that kind that are free, the cheapest first (and by plate when the price is the same):

```text
available scooter
AB-302-SC Piaggio 45.00/day
AB-301-SC Vespa 50.00/day
```

When none is free, print `No van available`.

## Service

Every vehicle goes to the garage after 1000 km. Keep each vehicle's kilometres since its last service. When a return takes them to 1000 or more, print a second line, and the vehicle can't be rented until it comes back:

```text
return AB-102-BB 14 1100
Ida returns AB-102-BB after 4 days and 1100 km, pays 765.00
AB-102-BB has done 1100 km since its service, off to the garage
```

A vehicle in service shows `in service` in `list`, is not in `available`, and can't be rented: `AB-102-BB is in service`.

`serviced <plate>` brings it back, `AB-102-BB is back`, with its kilometres at 0 again. For a vehicle that is not in service, print `AB-102-BB is not in service`.

## Customers

`customer <name>` lists a customer's finished rentals, and how much they paid in all:

```text
customer Ida
Honda (AB-101-AA), 3 days, 377.50
Skoda (AB-102-BB), 4 days, 765.00
Total: 1142.50
```

For someone with no finished rental, print `No rentals for Leo`.

## The monthly report

`report` shows what each kind of vehicle earned, the total, and the vehicle rented the most times (when two are equal, the first one in the fleet):

```text
report
cars: 1142.50
vans: 252.00
scooters: 290.00
Total: 1684.50
Most rented: AB-101-AA (1)
```

Before any return, the last line is `Most rented: none`.

Last, make sure the program never stops with an exception:

- a command with the wrong number of words prints how to use it: `Usage: rent <plate> <customer> <day>`, `Usage: return <plate> <day> <km>`, `Usage: available <car|van|scooter>`, `Usage: serviced <plate>` or `Usage: customer <name>`
- a day or a distance that is not a number prints `Not a number: soon`
