The corner grocery Alimentara Veche is getting its first real till. The owner runs offers every week (10% off dairy, three bottles of water for the price of two, five lei off a big shop) and wants the till to apply them by itself, print a clear receipt, give the change and keep loyalty points. Each kind of offer works differently but answers the same question, how much does it take off this cart, which makes it a perfect Java interface.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## The catalog

The till starts by reading the catalog: how many products, then one line each with its code, name, category and price:

```text
6
M01 Milk dairy 5.50
C02 Cheese dairy 18.00
B03 Bread bakery 4.20
A04 Apples fruit 7.90
J05 Juice drinks 9.00
W06 Water drinks 2.50
```

A product never changes, so a `record` fits it well. Keep the catalog in a `LinkedHashMap` by code. Print `Catalog: 6 products`, then keep reading commands until the cashier types `close`, and print `Till closed` then. Any other word prints `Unknown command: shout`.

## Scan

`scan <code> [quantity]` puts a product in the cart, one unless a quantity follows. Scanning a product already in the cart adds to it. Say the line as it now stands:

```text
scan M01 2
Milk x2 = 11.00
scan B03
Bread x1 = 4.20
```

An unknown code prints `No product X99`. Keep the cart as a map from product to quantity, in the order first scanned.

## The cart

- `cart` prints every line, then the subtotal and the total (the same, until the next step brings offers), or `Cart is empty`
- `remove <code>` takes one of a product out, `Water x2`; the line goes once it reaches 0 (`Water x0`), and a product not in the cart prints `Juice is not in the cart`

```text
cart
Milk x2 = 11.00
Bread x1 = 4.20
Water x3 = 7.50
Subtotal: 22.70
Total: 22.70
```

## Offers

Write an interface `Promotion` with two methods: `double discount(Map<Product, Integer> cart)`, how much it takes off a cart, and `String describe()`. Then three classes that implement it:

- **percent off a category**: `promo percent dairy 10` takes 10% off every dairy line
- **three for two**: `promo threefortwo W06` makes every third one of that product free
- **spend over**: `promo over 50 5` takes 5.00 off when the cart comes to 50.00 or more before any offer

```text
promo percent dairy 10
Promotion: 10% off dairy
promo threefortwo W06
Promotion: 3 for 2 on Water
promo over 50 5
Promotion: 5.00 off over 50.00
```

An offer kind that isn't one of these prints `Promotions are percent, threefortwo and over`. Keep the offers in a `List<Promotion>`, in the order they were added: the till never needs to know which kind each one is.

## Offers on the total

The total now takes off every offer that gives something, and `cart` shows a line for each, in the order added, before the total:

```text
cart
Milk x2 = 11.00
Bread x1 = 4.20
Water x3 = 7.50
Cheese x2 = 36.00
Subtotal: 58.70
10% off dairy: -4.70
3 for 2 on Water: -2.50
5.00 off over 50.00: -5.00
Total: 46.50
```

An offer that takes nothing off this cart doesn't show.

## Pay

`pay <amount>` takes the customer's money, rounds the total to the bani, gives the change and empties the cart for the next customer:

```text
pay 50
Paid 50.00, change 3.50
```

Not enough money prints `Total is 46.50, 6.50 short` and keeps the cart; paying for an empty cart prints `Cart is empty`.

## Loyalty card

`card <number>` scans a customer's loyalty card before paying, `Card 4417, 0 points`. When a card was scanned, paying earns one point for every whole 10 lei of the total, and says so after the change:

```text
Card 4417: +4 points, 4 in all
```

The card counts for one sale only: the next customer needs their own.

## End of the day

`report` counts the sales, adds up what they brought in, and names the product sold in the largest quantity (on a tie, the first by name):

```text
report
Sales: 2
Revenue: 95.50
Best seller: Juice (6)
```

Before any sale, it's `Best seller: none`. Finally, check that the program never stops with an exception: commands with the wrong number of words print their usage line (`Usage: scan <code> [quantity]`, `Usage: remove <code>`, `Usage: promo percent <category> <percent>`, `Usage: promo threefortwo <code>`, `Usage: promo over <amount> <off>`, `Usage: card <number>`, `Usage: pay <amount>`), and a quantity or amount that isn't a number prints `Not a number: lots`.
