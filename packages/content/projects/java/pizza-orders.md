Forno, a small pizzeria with a delivery scooter, takes orders by phone and writes them on a notepad. Prices for the three sizes are worked out in the cook's head, the deal for big orders gets forgotten, and nobody knows at night which pizza sold best. You'll write the order program at the counter: it knows the menu and the sizes, builds each order with its extras, applies the deal, charges the delivery and reports at closing time.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## The menu

The program starts by reading the menu: the first line is how many pizzas, then one line per pizza with its name (one word) and its price for a medium:

```text
4
Margherita 25
Diavola 32
Funghi 28
Quattro 35
```

Keep it in a `Map` from name to price; a `LinkedHashMap` remembers the order the pizzas came in. Print `Menu: 4 pizzas`, then keep reading commands until the cook types `close`, and print `Closed for today` then. Any other word prints `Unknown command: bake`.

## Three sizes

A pizza comes in three sizes, which are a perfect `enum`: `SMALL` costs 0.8 times the medium price, `MEDIUM` 1.0 and `LARGE` 1.3. Give the enum a field for that factor, set through its constructor.

`menu` prints every pizza with its price in each size, two decimals each:

```text
menu
Margherita Small 20.00 Medium 25.00 Large 32.50
Diavola Small 25.60 Medium 32.00 Large 41.60
Funghi Small 22.40 Medium 28.00 Large 36.40
Quattro Small 28.00 Medium 35.00 Large 45.50
```

The size's name prints with a capital and the rest small: `name()` gives `LARGE`, and a method on the enum can turn it into `Large`.

## Orders

`new <customer>` opens an order, numbered from 1:

```text
new Ana
Order 1 for Ana
```

`add <order> <pizza> <size> [extras...]` adds a pizza to an order. Extras cost 3.00 each, and the kitchen has four: `cheese`, `olives`, `chili` and `ham`.

```text
add 1 Margherita large
Added Large Margherita to order 1, 32.50
add 1 Diavola small chili
Added Small Diavola +chili to order 1, 28.60
```

Refuse the pizza, and add nothing, when:

- the order doesn't exist: `No order 3`
- the pizza isn't on the menu: `No Hawaii on the menu`
- the size isn't one of the three: `Sizes are small, medium and large` (`Size.valueOf` throws an `IllegalArgumentException` for anything else, which you can catch)
- an extra isn't one of the four: `No extra called pineapple`

Sizes can be typed in any case. Make an `Order` class holding its items, and an item class that knows its pizza, size, extras and price, with a `toString()` that writes it the way it prints.

## Show an order

`show <order>` prints the order, an item per line indented by two spaces, and the total:

```text
show 1
Order 1 for Ana
  Large Margherita 32.50
  Small Diavola +chili 28.60
Total: 61.10
```

## The deal

Order three pizzas or more and the cheapest one is free. `show` adds a line for it before the total, and the total drops:

```text
show 1
Order 1 for Ana
  Large Margherita 32.50
  Small Diavola +chili 28.60
  Medium Funghi +cheese +olives 34.00
  Deal: cheapest pizza free -28.60
Total: 66.50
```

The price that counts is the item's whole price, extras included. Let the `Order` work out its own subtotal, deal and total in methods.

## Delivery

`send <order> <km>` sends the order out with the scooter. Delivery costs 5.00, plus 1.00 for every kilometre started beyond the first 3, and it's free when the order comes to 100.00 or more after the deal:

```text
send 1 5
Order 1 sent to Ana, delivery 7.00, total 73.50
```

Once sent, an order can't change: `add` and `send` print `Order 1 is already on its way`. An order with no pizza can't be sent: `Order 2 is empty`. After it's sent, `show` lists the delivery before the total, `  Delivery 7.00`.

## Closing time

`report` counts the orders sent, what they brought in (totals with delivery), and how many of each pizza went out, the best seller first, ties by name:

```text
report
Orders sent: 2
Revenue: 162.00
Quattro: 2
Diavola: 1
Funghi: 1
Margherita: 1
```

Only pizzas of orders sent count; a `HashMap` from pizza to count, with `merge`, keeps them, and a list of names sorted with a comparator prints them in order.

## Survive bad input

The phone rings while the cook types. Your program must never stop with an exception:

- a command with too few words prints how to use it: `Usage: new <customer>`, `Usage: add <order> <pizza> <size> [extras]`, `Usage: show <order>`, `Usage: send <order> <km>`
- an order number or a distance that isn't a number prints `Not a number: two`, with the word as typed
- an empty line is skipped

Catch `NumberFormatException` where you parse numbers. Throwing an `IllegalArgumentException` with the line to print, and catching it once around the command, keeps the messages in one place.
