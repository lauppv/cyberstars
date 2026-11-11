The supermarket in Ida's neighbourhood is putting in self-checkout kiosks. A kiosk spends most of its life saying no: that barcode doesn't exist, put the bananas on the scale first, a staff member must check your age before the wine, your card was declined. You'll write a kiosk's program, and every one of those "no"s will be an exception of its own, thrown where the problem is found and caught where the customer is told.

You build it one step at a time, in one `Main.java`. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests send customers to your kiosk that it has never seen. Passing them finishes the project.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`.

## The products

The kiosk starts by reading the products: how many, then one line each with the barcode, the name, the price and how it's sold, `unit`, `kg` (the price is per kilo) or `alcohol`:

```text
5
101 Milk 6.50 unit
102 Bread 4.20 unit
201 Bananas 7.90 kg
301 Beer 5.00 alcohol
302 Wine 32.00 alcohol
```

Keep prices in cents, as `int` (`Math.round(price * 100)`), so sums are exact. Print `Kiosk ready, 5 products`, then read commands until `quit`. Any other word prints `Unknown command: dance`.

## Scanning, and your first exception

`scan <code> [quantity]` adds a product to the basket, one unless a quantity follows, and prints the line with its cost:

```text
scan 101 2
Milk x2 13.00
```

A barcode that doesn't exist is the first problem, and it gets a class: `UnknownProductException`, which extends a class of your own, `KioskException`, which extends `Exception`. Write the method that looks a product up so it **throws** it (`throws UnknownProductException` in its signature, since it's a checked exception), and catch `KioskException` once, around the command, printing its message:

```text
scan 999
Unknown product 999
```

Every later problem is another subclass of `KioskException`, so that one `catch` handles them all.

## Things sold by weight

Scanning a `kg` product throws a `WeighFirstException`: `Put the Bananas on the scale first`. `weigh <code> <grams>` puts it on the scale instead: its cost is the price per kilo times the grams, divided by 1000, rounded to the nearest ban (a half rounds up, which `Math.round` does):

```text
weigh 201 1250
Bananas 1250 g 9.88
```

Weighing something that isn't sold by weight prints `Milk isn't sold by weight`.

## Age check

Scanning an `alcohol` product puts it aside, waiting for a staff member, and throws a `StaffNeededException`: `Please wait for a staff member to check your age`. A quantity puts that many aside, one at a time.

`staff <age>` is the staff member checking the customer's ID: at 18 or older, every waiting item goes into the basket, `Beer x1 5.00 (age checked)` each; younger, each one prints `Sorry, no Wine under 18` and stays out. With nothing waiting, `Nothing needs a staff member`.

`total` shows what's owed so far, and how many items are waiting, if any: `To pay: 22.88, 2 waiting for staff`.

## Paying

`pay cash <amount>` and `pay card <PIN>` end the shopping. Each problem is a `PaymentException` with its own message, unless items wait for staff, which throws the `StaffNeededException` again:

- nothing in the basket: `Nothing to pay for`
- cash that doesn't cover the total: `That's 12.88 short`
- a PIN that isn't 4 digits: `A PIN has 4 digits`
- a card payment over 500.00: `Card declined: over 500.00`
- anything but cash or card: `Pay by cash or card`

A payment that goes through prints what was paid (and the change, for cash), then the receipt, and the basket starts empty for the next customer:

```text
Paid 32.88 by card
Receipt:
  Milk x2 13.00
  Bananas 1250 g 9.88
  Beer x1 5.00
  Beer x1 5.00
  Total 32.88
```

## Count every attempt

The supermarket wants to know how often paying goes wrong. Count every `pay` attempt, successful or not, in a `finally` block: it runs whether the payment worked or threw. At `quit`, print the day:

```text
Sales: 1, takings 32.88, payment attempts 5
```

Finally, the exceptions Java throws by itself: a quantity, weight or age that isn't a number throws `NumberFormatException`, which is unchecked; catch it next to yours and print `Not a number: two`. Commands with the wrong number of words print their usage (`Usage: scan <code> [quantity]`, `Usage: weigh <code> <grams>`, `Usage: staff <age>`, `Usage: pay <cash|card> <amount or PIN>`). The kiosks open on Monday.
