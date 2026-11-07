The snack machine in the hallway of a university building is getting a new brain. The old one ate coins and never gave change. You'll write the program inside the new one: it knows its products and prices, takes coins, gives the snack and the change in real coins from its own coin tubes, and tells the technician what sold.

You build it one step at a time, in one C file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is. Run it, then type the lines of an example yourself to see what it answers.

## Load the products

The machine starts by reading what's inside: the first line is how many products (at most 20), then one line per product with its slot code, its name (one word), its price and how many are in the slot:

```text
3
A1 Water 250 2
A2 Chips 380 1
B1 Coffee 420 3
```

Prices are in bani, whole numbers, so `250` is 2.50 lei: money as whole numbers never suffers the rounding of `float`. Keep the products in an array of structs.

Print `Loaded 3 products`. Then keep reading commands until the technician types `quit`, and print `Bye` then. Any other word prints `Unknown command: dance`.

## Show the products

`list` prints every product in the order loaded, with its price in lei and two decimals, and how many are left:

```text
list
A1 Water 2.50 (2 left)
A2 Chips 3.80 (1 left)
B1 Coffee 4.20 (3 left)
```

An empty slot shows `(sold out)` instead. Write a function that prints an amount of bani as lei (`%d.%02d` with a division and a remainder); every later step uses it.

## Insert coins

`coin <value>` takes a coin. The machine knows four: 10, 50, 100 and 500 bani. Each accepted coin adds to the credit:

```text
coin 100
Credit: 1.00
coin 20
Coin rejected: 20
coin 100
Credit: 2.00
```

## Buy

`buy <code>` sells a product when the credit covers its price. For now, just say so and use up the whole credit (change comes in the next step):

```text
buy A1
Here is your Water
```

The slot has one fewer, and the credit is back to 0. Refuse, and change nothing, when:

- there's no slot with that code: `No product A9`
- the slot is empty: `Chips is sold out`
- the credit is too small: `Chips costs 3.80, credit 2.00`

Check them in that order.

## Change, in real coins

The machine has a tube for each kind of coin, and it starts with 5 coins in each. Every coin inserted goes into its tube, and change comes out of the tubes, biggest coins first: as many 500s as fit and are there, then 100s, 50s and 10s. Before `Here is your ...`, print the coins that come out:

```text
coin 500
Credit: 5.00
buy A2
Coins out: 100 10 10
Here is your Chips
```

No line at all when there's no change. When the tubes can't make the exact change, the machine sells nothing: it says so, gives the whole credit back in coins and keeps the product:

```text
buy B1
Exact change only, 5.00 back
Coins out: 500
```

Work out which coins you'd use first, and take them out of the tubes only once you know the change works out.

## Changed my mind

`refund` gives the credit back in coins, the same way as change:

```text
coin 50
Credit: 0.50
refund
Coins out: 50
```

With no credit it prints `No credit`.

## The technician's visit

Two commands for the technician:

- `restock <code> <count>` adds products to a slot and prints `Chips: 4 left`; an unknown code prints `No product A9`
- `report` lists every product sold at least once since the start with how many, then what the machine earned and the coins in each tube:

```text
report
Water: 1 sold
Chips: 1 sold
Coffee: 1 sold
Earned: 10.50
Coins: 7x500 6x100 5x50 0x10
```

The 10 bani tube is empty: the technician will bring more before the machine starts refusing sales.

## Survive bad input

A machine in a hallway gets poked at. Your program must never crash or loop forever:

- a `coin` whose value isn't a number prints `Usage: coin <value>` and skips that word
- a `restock` without a code and a whole number of at least 1 prints `Usage: restock <code> <count>`, skipping a count that isn't a number
- names and codes are read with a width, such as `%31s`, so a long word can't overflow its array

`scanf` returns how many values it read: when it's less than you asked for, the input wasn't what you expected. And when the very first `scanf` of the loop reads nothing, the input has ended, so stop as if `quit` had been typed.
