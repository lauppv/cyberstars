The economics club at a high school in Timișoara runs a stock market game: each member gets pretend shares of a pretend company and trades them with the others. Until now, a teacher matched buyers and sellers by hand on a whiteboard. You'll write the exchange itself, the order book: it keeps every offer to buy and to sell, matches them the moment their prices meet, and tells everyone what they own.

You build it one step at a time, in one `Main.java`. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests trade on days your program has never seen. Passing them finishes the project.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`.

## Orders

Print `Market open`, then read commands until `close` (print `Market closed`). Any other word prints `Unknown command: shout`.

`buy <trader> <quantity> <price>` and `sell <trader> <quantity> <price>` place an order: buy up to that many shares paying at most that price each, or sell them for at least that price. Quantities and prices are whole numbers above 0. Orders are numbered from 1:

```text
sell Dan 10 105
Order 1: Dan sells 10 at 105
```

Make an `Order` class with its number, trader, side, quantity and price.

## The book

Orders waiting for a match sit in the book, one side for buyers and one for sellers. Each side always needs its best order first: the buyer paying the most, the seller asking the least, and at the same price the older order. That's exactly what a `PriorityQueue` with a `Comparator` gives you:

```java
Comparator.comparingInt((Order o) -> -o.price).thenComparingInt(o -> o.id)
```

`book` shows both sides, each best first:

```text
Sell:
  103 x 5  (Eva, order 2)
  103 x 8  (Leo, order 3)
  105 x 10  (Dan, order 1)
Buy:
  100 x 4  (Ana, order 4)
```

A `PriorityQueue` only promises its best order at the head; to list them all in order, copy them into a list and sort it with the same comparator.

## Matching

When a new order comes in, it first trades with the best orders on the other side, as long as their prices meet: a buy trades with sellers asking no more than its price, a sell with buyers paying no less. The trade happens at the price of the order that was already waiting:

```text
buy Mara 12 104
Order 5: Mara buys 12 at 104
  Trade: 5 at 103, Mara buys from Eva
  Trade: 7 at 103, Mara buys from Leo
```

An order that doesn't trade at all goes into the book.

## Bits and pieces

Quantities rarely line up. A trade is for the smaller of the two quantities; the order that runs out leaves the book (or never enters it), and the other keeps its rest. Leo's 8 shares above are now 1 in the book. A new order with some shares left after trading goes into the book with them, and says so: `  4 left in the book`.

One more rule: nobody trades with themselves. When the best waiting order belongs to the new order's own trader, the old order is cancelled first: `  Order 4 cancelled, Ana can't trade with themselves`.

## Cancel and market orders

- `cancel <order>` takes an order out of the book, `Order 4 cancelled`, or prints `No order 4 in the book`
- `market <trader> <buy|sell> <quantity>` trades at whatever price the book offers, best first, until it's filled: `Order 7: Mara buys 20 at any price`. A market order never waits in the book; what it can't fill is dropped: `  5 not filled, nobody left to trade with`

## Who owns what

Every trader starts with 0 shares and 0 cash; a purchase adds shares and takes cash, a sale the other way round, so both can go negative (this is a game); one share reads `1 share`. `traders` lists everyone who placed an order, by name:

```text
Ana: -20 shares, cash 1980
Dan: 0 shares, cash 0
```

`stats` shows the last trade's price, the shares traded and the average price paid, with two decimals, or `No trades yet`. Finally, bad input: `buy`, `sell`, `market` and `cancel` with the wrong words print `Usage: buy <trader> <quantity> <price>` (and so on), a number that isn't one `Not a number: ten`, and 0 or less `Quantities and prices are whole numbers above 0`. The teacher retired the whiteboard.
