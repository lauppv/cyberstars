Forno is a small pizza place with one delivery scooter. It takes orders by phone and writes them on a notepad. The cook works out the prices of the three sizes in his head, forgets the deal for big orders, and at night nobody knows which pizza sold best. You will write the order program for the counter in Java. It knows the menu and the sizes, builds each order with its extras, gives the deal, adds the delivery, and makes a report at closing time.

**How it works.** The program first reads the menu, then commands, and answers each command at once. Here is a session as you see it in the output box when you run a finished program. The lines you type are followed by the program's answers:

```text
4
Margherita 25
Diavola 32
Funghi 28
Quattro 35
Menu: 4 pizzas
menu
Margherita Small 20.00 Medium 25.00 Large 32.50
Diavola Small 25.60 Medium 32.00 Large 41.60
Funghi Small 22.40 Medium 28.00 Large 36.40
Quattro Small 28.00 Medium 35.00 Large 45.50
new Ida
Order 1 for Ida
add 1 Margherita large
Added Large Margherita to order 1, 32.50
add 1 Diavola small chili
Added Small Diavola +chili to order 1, 28.60
add 1 Hawaii large
No Hawaii on the menu
add 1 Funghi medium cheese olives
Added Medium Funghi +cheese +olives to order 1, 34.00
show 1
Order 1 for Ida
  Large Margherita 32.50
  Small Diavola +chili 28.60
  Medium Funghi +cheese +olives 34.00
  Deal: cheapest pizza free -28.60
Total: 66.50
send 1 5
Order 1 sent to Ida, delivery 7.00, total 73.50
new Dan
Order 2 for Dan
add 2 Quattro large
Added Large Quattro to order 2, 45.50
add 2 Quattro medium ham
Added Medium Quattro +ham to order 2, 38.00
send 2 2.5
Order 2 sent to Dan, delivery 5.00, total 88.50
report
Orders sent: 2
Revenue: 162.00
Quattro: 2
Diavola: 1
Funghi: 1
Margherita: 1
close
Closed for today
```

The commands:

| Command                                  | What it does                         |
| ---------------------------------------- | ------------------------------------ |
| `menu`                                   | shows every pizza in the three sizes |
| `new <customer>`                         | opens an order                       |
| `add <order> <pizza> <size> [extras...]` | adds a pizza to an order             |
| `show <order>`                           | shows an order and its total         |
| `send <order> <km>`                      | sends an order with the scooter      |
| `report`                                 | what was sold today                  |
| `close`                                  | ends the program                     |

Some words you will meet:

| Word    | What it means                                                              |
| ------- | -------------------------------------------------------------------------- |
| extra   | something more on a pizza: `cheese`, `olives`, `chili` or `ham`, 3.00 each |
| deal    | with three pizzas or more, the cheapest one is free                        |
| revenue | all the money the orders brought                                           |

**To try your program**, press Run, then type or paste the lines in the output box. `close` ends the program.

Build the program one step at a time, in one `Main.java`. Each step adds a command or a rule, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests play other evenings of orders. Passing them finishes the project.

## The menu

Read every line with a `Scanner` (`nextLine()`) and split it into words. The program first reads the menu. The first line is how many pizzas there are. Then comes one line for each pizza: its name (one word) and its price as a medium:

```text
4
Margherita 25
Diavola 32
Funghi 28
Quattro 35
```

Keep the menu in a `Map` from name to price. A `LinkedHashMap` keeps the order the pizzas came in. Print `Menu: 4 pizzas`, then read commands until the cook types `close`, and print `Closed for today` then. For any other word, print `Unknown command: bake`.

## Three sizes

A pizza has three sizes, which make a good `enum`:

| Size     | Price                      |
| -------- | -------------------------- |
| `SMALL`  | 0.8 times the medium price |
| `MEDIUM` | the medium price           |
| `LARGE`  | 1.3 times the medium price |

Give the enum a field for that number, set in its constructor.

`menu` prints every pizza with its price in each size, with two decimals:

```text
menu
Margherita Small 20.00 Medium 25.00 Large 32.50
Diavola Small 25.60 Medium 32.00 Large 41.60
Funghi Small 22.40 Medium 28.00 Large 36.40
Quattro Small 28.00 Medium 35.00 Large 45.50
```

The size prints with a capital letter first and small letters after: `name()` gives `LARGE`, and a method of the enum can turn it into `Large`.

## Orders

`new <customer>` opens an order. Orders are numbered from 1:

```text
new Ida
Order 1 for Ida
```

`add <order> <pizza> <size> [extras...]` adds a pizza to an order. Each extra costs 3.00:

```text
add 1 Margherita large
Added Large Margherita to order 1, 32.50
add 1 Diavola small chili
Added Small Diavola +chili to order 1, 28.60
```

Say no, and add nothing, when:

| Answer                              | When                                                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `No order 3`                        | the order doesn't exist                                                                                                       |
| `No Hawaii on the menu`             | the pizza is not on the menu                                                                                                  |
| `Sizes are small, medium and large` | the size is not one of the three. `Size.valueOf` throws an `IllegalArgumentException` for anything else, and you can catch it |
| `No extra called pineapple`         | an extra is not one of the four                                                                                               |

The size can be typed with small or capital letters.

Make a class `Order` that keeps its items, and a class for an item that knows its pizza, size, extras and price. Give the item a `toString()` that writes it the way it prints.

## Show an order

`show <order>` prints the order, one item on each line with two spaces in front, and the total:

```text
show 1
Order 1 for Ida
  Large Margherita 32.50
  Small Diavola +chili 28.60
Total: 61.10
```

## The deal

With three pizzas or more in an order, the cheapest one is free. `show` adds a line for it before the total, and the total is smaller:

```text
show 1
Order 1 for Ida
  Large Margherita 32.50
  Small Diavola +chili 28.60
  Medium Funghi +cheese +olives 34.00
  Deal: cheapest pizza free -28.60
Total: 66.50
```

The price that counts is the item's whole price, with its extras. Let the `Order` work out its own subtotal, deal and total, in methods.

## Delivery

`send <order> <km>` sends the order with the scooter. Delivery costs 5.00, plus 1.00 for every kilometre or part of a kilometre after the first 3. It is free when the order costs 100.00 or more after the deal:

```text
send 1 5
Order 1 sent to Ida, delivery 7.00, total 73.50
```

After an order is sent, it can't change: `add` and `send` print `Order 1 is already on its way`. An order with no pizza can't be sent: `Order 2 is empty`. After it is sent, `show` lists the delivery before the total: `  Delivery 7.00`.

## Closing time

`report` counts the orders sent, the money they brought (the totals, with delivery), and how many of each pizza went out, the best seller first, and by name when two are equal:

```text
report
Orders sent: 2
Revenue: 162.00
Quattro: 2
Diavola: 1
Funghi: 1
Margherita: 1
```

Only the pizzas of sent orders count. A `HashMap` from pizza to count, with `merge`, keeps them. Then a list of the names, sorted with a comparator, prints them in order.

## Survive bad input

The phone rings while the cook types. Your program must never stop with an exception:

- a command with too few words prints how to use it: `Usage: new <customer>`, `Usage: add <order> <pizza> <size> [extras]`, `Usage: show <order>` or `Usage: send <order> <km>`
- an order number or a distance that is not a number prints `Not a number: two`, with the word as it was typed
- an empty line is skipped

Catch `NumberFormatException` where you read numbers. You can also throw an `IllegalArgumentException` with the line to print, and catch it once around the whole command: then all the messages are in one place.
