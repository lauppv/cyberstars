The snack machine in the hall of a university building is getting a new brain. The old one took coins and never gave change. You will write, in C, the program inside the new one. It knows its products and their prices, takes coins, gives the snack and the change in real coins from its own coin tubes, and tells the technician what was sold.

**How it works.** The program first reads the products, then commands, and answers each command at once. Here is a session as you see it in the output box when you run a finished program. The lines you type are followed by the machine's answers:

```text
2
A1 Gum 150 3
A2 Tea 330 1
Loaded 2 products
coin 500
Credit: 5.00
buy A2
Coins out: 100 50 10 10
Here is your Tea
coin 500
Credit: 5.00
buy A2
Tea is sold out
refund
Coins out: 500
coin 10
Credit: 0.10
coin 10
Credit: 0.20
coin 50
Credit: 0.70
buy A1
Gum costs 1.50, credit 0.70
coin 100
Credit: 1.70
buy A1
Coins out: 10 10
Here is your Gum
report
Gum: 1 sold
Tea: 1 sold
Earned: 4.80
Coins: 6x500 5x100 5x50 3x10
quit
Bye
```

The commands:

| Command                  | What it does                                                 |
| ------------------------ | ------------------------------------------------------------ |
| `list`                   | shows the products, their prices and how many are left       |
| `coin <value>`           | puts a coin in                                               |
| `buy <code>`             | buys the product in that slot                                |
| `refund`                 | gives the money back                                         |
| `restock <code> <count>` | the technician adds products to a slot                       |
| `report`                 | what was sold, what the machine earned, and the coins inside |
| `quit`                   | ends the program                                             |

Some words you will meet:

| Word   | What it means                                                           |
| ------ | ----------------------------------------------------------------------- |
| slot   | the place of one product in the machine, with a code like `A1`          |
| credit | the money put in and not spent yet                                      |
| change | the money the machine gives back when the credit is more than the price |
| tube   | the place inside the machine for one kind of coin                       |

**To try your program**, press Run, then type or paste the lines in the output box. `quit` ends the program.

Build the program one step at a time, in one C file. Each step adds a command or a rule, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests try other machines. Passing them finishes the project.

## Load the products

The machine first reads what is inside it. The first line is how many products there are (at most 20). Then comes one line for each product: its slot code, its name (one word), its price, and how many are in the slot:

```text
3
A1 Water 250 2
A2 Chips 380 1
B1 Coffee 420 3
```

Prices are in cents, as whole numbers: `250` is 2.50 euros. Money in whole numbers is always exact, while `float` numbers sometimes round. Keep the products in an array of structs.

Print `Loaded 3 products`. Then read commands until the technician types `quit`, and print `Bye` then. Read each command word with `scanf("%s", cmd)`, and use `strcmp` to see which one it is. For any other word, print `Unknown command: dance`.

## Show the products

`list` prints every product in the order it was loaded, with its price in euros with two decimals, and how many are left:

```text
list
A1 Water 2.50 (2 left)
A2 Chips 3.80 (1 left)
B1 Coffee 4.20 (3 left)
```

An empty slot shows `(sold out)` in place of the number left.

Write a function that prints cents as euros: `%d.%02d`, with a division and a remainder by 100. Every next step uses it.

## Insert coins

`coin <value>` takes a coin. The machine knows four coins: 10, 50, 100 and 500 cents. Each coin it takes adds to the credit:

```text
coin 100
Credit: 1.00
coin 20
Coin rejected: 20
coin 100
Credit: 2.00
```

## Buy

`buy <code>` sells a product when the credit is enough for its price. For now, just say so and use up the whole credit (change comes in the next step):

```text
buy A1
Here is your Water
```

The slot has one product less, and the credit is 0 again. Say no, and change nothing, when:

- no slot has that code: `No product A9`
- the slot is empty: `Chips is sold out`
- the credit is too small: `Chips costs 3.80, credit 2.00`

Check them in this order.

## Change, in real coins

The machine has a tube for each kind of coin, and each tube starts with 5 coins. Every coin put in goes into its tube, and the change comes out of the tubes, the biggest coins first: as many 500s as fit and as the tube has, then 100s, then 50s, then 10s. Before `Here is your ...`, print the coins that come out:

```text
coin 500
Credit: 5.00
buy A2
Coins out: 100 10 10
Here is your Chips
```

When there is no change, print no `Coins out` line.

When the tubes can't give the exact change, the machine sells nothing. It says so, gives the whole credit back in coins, and keeps the product:

```text
buy B1
Exact change only, 5.00 back
Coins out: 500
```

First work out which coins you would use, and take them out of the tubes only when you know the change works.

## Changed my mind

`refund` gives the credit back in coins, like change:

```text
coin 50
Credit: 0.50
refund
Coins out: 50
```

With no credit, it prints `No credit`.

## The technician's visit

Two commands are for the technician:

- `restock <code> <count>` adds products to a slot and prints `Chips: 4 left`. For a code that is not a slot, print `No product A9`
- `report` lists every product sold at least once since the start, with how many. Then what the machine earned, and how many coins are in each tube:

```text
report
Water: 1 sold
Chips: 1 sold
Coffee: 1 sold
Earned: 10.50
Coins: 7x500 6x100 5x50 0x10
```

The tube of 10 cents is empty: the technician will bring more before the machine starts to say no.

## Survive bad input

People in a hall press anything. Your program must never stop with an error or loop forever:

- a `coin` with a value that is not a number: print `Usage: coin <value>` and skip that word
- a `restock` without a code and a whole number of at least 1: print `Usage: restock <code> <count>`, and skip a count that is not a number
- read names and codes with a width, like `%31s`, so a long word can't go past the end of its array

`scanf` gives back how many values it read. When that is less than you asked for, the input was not what you expected. When the first `scanf` of the loop reads nothing, the input has ended: stop as if `quit` had been typed.
