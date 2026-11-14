The supermarket near Ida's home is putting in self-checkout machines, where customers scan and pay without a cashier. Such a machine says no very often: that barcode doesn't exist, put the bananas on the scale first, a worker must check your age before the wine, your card was refused. You will write the machine's program in Java, and every one of those "no"s will be an exception of its own: thrown where the problem is found, and caught where the customer is told.

**How it works.** The program first reads the products, then commands, and answers each command at once. Here is a session as you see it in the output box when you run a finished program. The lines you type are followed by the machine's answers:

```text
5
101 Milk 6.50 unit
102 Bread 4.20 unit
201 Bananas 7.90 kg
301 Beer 5.00 alcohol
302 Wine 32.00 alcohol
Kiosk ready, 5 products
scan 101 2
Milk x2 13.00
scan 999
Unknown product 999
scan 201
Put the Bananas on the scale first
weigh 201 1250
Bananas 1250 g 9.88
weigh 101 300
Milk isn't sold by weight
scan 301 2
Please wait for a staff member to check your age
total
To pay: 22.88, 2 waiting for staff
pay cash 50
Please wait for a staff member to check your age
staff 25
Beer x1 5.00 (age checked)
Beer x1 5.00 (age checked)
scan 302
Please wait for a staff member to check your age
staff 16
Sorry, no Wine under 18
total
To pay: 32.88
pay cash 20
That's 12.88 short
pay card 12
A PIN has 4 digits
pay card 1234
Paid 32.88 by card
Receipt:
  Milk x2 13.00
  Bananas 1250 g 9.88
  Beer x1 5.00
  Beer x1 5.00
  Total 32.88
pay card 1234
Nothing to pay for
quit
Sales: 1, takings 32.88, payment attempts 5
```

The commands:

| Command                  | What it does                               |
| ------------------------ | ------------------------------------------ |
| `scan <code> [quantity]` | scans a product, once or that many times   |
| `weigh <code> <grams>`   | puts a product sold by weight on the scale |
| `staff <age>`            | a worker checks the customer's age         |
| `total`                  | what the customer has to pay so far        |
| `pay cash <amount>`      | pays with money                            |
| `pay card <PIN>`         | pays with a card and its PIN               |
| `quit`                   | ends the program                           |

Some words you will meet:

| Word              | What it means                                                            |
| ----------------- | ------------------------------------------------------------------------ |
| barcode           | the number on a product, here like `101`                                 |
| basket            | the products scanned and not paid yet                                    |
| PIN               | the secret 4-digit code of a card                                        |
| exception         | an object Java throws when something goes wrong, and a `catch` can catch |
| checked exception | an exception Java makes you either catch or name with `throws`           |

**To try your program**, press Run, then type or paste the lines in the output box. `quit` ends the program.

Build the program one step at a time, in one `Main.java`. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests send other customers to your machine. Passing them finishes the project.

## The products

Read every line with a `Scanner` (`nextLine()`) and split it into words. The machine first reads the products: how many there are, then one line for each: the barcode, the name, the price, and how it is sold: `unit` (by the piece), `kg` (the price is for one kilo) or `alcohol`:

```text
5
101 Milk 6.50 unit
102 Bread 4.20 unit
201 Bananas 7.90 kg
301 Beer 5.00 alcohol
302 Wine 32.00 alcohol
```

Keep prices in cents, as `int` (`Math.round(price * 100)`), so all sums are exact. Print `Kiosk ready, 5 products`, then read commands until `quit`. For any other word, print `Unknown command: dance`.

## Scanning, and your first exception

`scan <code> [quantity]` puts a product in the basket, one time, or as many times as the quantity after it. Print the line with its price:

```text
scan 101 2
Milk x2 13.00
```

A barcode that doesn't exist is the first problem, and it gets its own class: `UnknownProductException`. It extends a class of your own, `KioskException`, which extends `Exception`.

Write the method that finds a product so that it **throws** this exception. It is a checked exception, so the method needs `throws UnknownProductException` in its signature. Then catch `KioskException` once, around the whole command, and print its message:

```text
scan 999
Unknown product 999
```

Every next problem is another class that extends `KioskException`, so that one `catch` handles all of them.

## Things sold by weight

Scanning a `kg` product throws a `WeighFirstException`: `Put the Bananas on the scale first`.

`weigh <code> <grams>` puts it on the scale instead. Its price is the price for a kilo times the grams, divided by 1000, rounded to the nearest cent (a half goes up, as `Math.round` does):

```text
weigh 201 1250
Bananas 1250 g 9.88
```

Weighing a product that is not sold by weight prints `Milk isn't sold by weight`.

## Age check

Scanning an `alcohol` product puts it aside, to wait for a worker, and throws a `StaffNeededException`: `Please wait for a staff member to check your age`. With a quantity, that many wait, each one alone.

`staff <age>` is the worker checking the customer's ID card:

- at 18 or older, every waiting product goes into the basket, each one with `Beer x1 5.00 (age checked)`
- younger, each one prints `Sorry, no Wine under 18` and stays out
- with nothing waiting, print `Nothing needs a staff member`

`total` shows what the customer must pay so far, and how many products wait, if any: `To pay: 22.88, 2 waiting for staff`.

## Paying

`pay cash <amount>` and `pay card <PIN>` end the shopping. Each problem is a `PaymentException` with its own message. But if products wait for a worker, `pay` throws the `StaffNeededException` again.

| Message                      | When                            |
| ---------------------------- | ------------------------------- |
| `Nothing to pay for`         | the basket is empty             |
| `That's 12.88 short`         | the cash is less than the total |
| `A PIN has 4 digits`         | the PIN is not 4 digits         |
| `Card declined: over 500.00` | a card payment over 500.00      |
| `Pay by cash or card`        | anything but `cash` or `card`   |

A payment that works prints what was paid (and the change, for cash), then the receipt. The basket is then empty for the next customer:

```text
Paid 32.88 by card
Receipt:
  Milk x2 13.00
  Bananas 1250 g 9.88
  Beer x1 5.00
  Beer x1 5.00
  Total 32.88
```

With cash, the first line is like `Paid 20.00 in cash, change 4.69`.

## Count every attempt

The supermarket wants to know how often paying goes wrong. Count every `pay`, whether it works or not, in a `finally` block: it runs both when the payment works and when it throws. At `quit`, print the day:

```text
Sales: 1, takings 32.88, payment attempts 5
```

Last, the exceptions Java throws by itself. A quantity, a weight or an age that is not a number throws `NumberFormatException`, which is unchecked. Catch it next to yours and print `Not a number: two`.

A command with the wrong number of words prints how to use it: `Usage: scan <code> [quantity]`, `Usage: weigh <code> <grams>`, `Usage: staff <age>` or `Usage: pay <cash|card> <amount or PIN>`. The machines open on Monday.
