The economics club at a high school in Edinburgh plays a stock market game. Each member gets pretend shares of a pretend company and trades them with the others. Until now, a teacher found the buyer for each seller by hand, on a whiteboard. You will write the market itself in Java: the order book. It keeps every offer to buy and to sell, makes a trade as soon as a buyer and a seller agree on the price, and tells everyone what they own.

**How it works.** The program reads commands and answers each one at once. Here is a session as you see it in the output box when you run a finished program. Each command you type is followed by the answer:

```text
Market open
sell Dan 10 105
Order 1: Dan sells 10 at 105
sell Eva 5 103
Order 2: Eva sells 5 at 103
sell Leo 8 103
Order 3: Leo sells 8 at 103
buy Ida 4 100
Order 4: Ida buys 4 at 100
book
Sell:
  103 x 5  (Eva, order 2)
  103 x 8  (Leo, order 3)
  105 x 10  (Dan, order 1)
Buy:
  100 x 4  (Ida, order 4)
buy Mara 12 104
Order 5: Mara buys 12 at 104
  Trade: 5 at 103, Mara buys from Eva
  Trade: 7 at 103, Mara buys from Leo
book
Sell:
  103 x 1  (Leo, order 3)
  105 x 10  (Dan, order 1)
Buy:
  100 x 4  (Ida, order 4)
sell Ida 20 99
Order 6: Ida sells 20 at 99
  Order 4 cancelled, Ida can't trade with themselves
book
Sell:
  99 x 20  (Ida, order 6)
  103 x 1  (Leo, order 3)
  105 x 10  (Dan, order 1)
Buy:
cancel 4
No order 4 in the book
market Mara buy 20
Order 7: Mara buys 20 at any price
  Trade: 20 at 99, Mara buys from Ida
traders
Dan: 0 shares, cash 0
Eva: -5 shares, cash 515
Ida: -20 shares, cash 1980
Leo: -7 shares, cash 721
Mara: 32 shares, cash -3216
stats
Last price: 99
Shares traded: 32
Average price: 100.50
close
Market closed
```

The commands:

| Command                                  | What it does                                                         |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `buy <trader> <quantity> <price>`        | an offer to buy that many shares, paying at most that price for each |
| `sell <trader> <quantity> <price>`       | an offer to sell that many shares, for at least that price each      |
| `book`                                   | shows the offers that wait                                           |
| `cancel <order>`                         | takes an offer away                                                  |
| `market <trader> <buy\|sell> <quantity>` | buys or sells at any price                                           |
| `traders`                                | what each trader owns                                                |
| `stats`                                  | numbers about the trades                                             |
| `close`                                  | ends the program                                                     |

Some words you will meet:

| Word     | What it means                                                                     |
| -------- | --------------------------------------------------------------------------------- |
| share    | a small part of a company, which people buy and sell                              |
| order    | an offer to buy or to sell shares                                                 |
| trade    | a buyer and a seller agree, and shares change hands                               |
| the book | all the orders that wait for a trade, buyers on one side and sellers on the other |

**To try your program**, press Run, then type or paste the commands in the output box. `close` ends the program.

Build the program one step at a time, in one `Main.java`. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests trade on other days. Passing them finishes the project.

## Orders

Read every line with a `Scanner` (`nextLine()`) and split it into words. Print `Market open`, then read commands until `close`, and print `Market closed` then. For any other word, print `Unknown command: shout`.

`buy <trader> <quantity> <price>` and `sell <trader> <quantity> <price>` make an order. Quantities and prices are whole numbers above 0. Orders are numbered from 1:

```text
sell Dan 10 105
Order 1: Dan sells 10 at 105
```

Make a class `Order` with its number, its trader, its side (buy or sell), its quantity and its price.

## The book

Orders that wait for a trade are in the book, with one side for buyers and one for sellers. Each side always needs its best order first:

- for buyers, the one that pays the most
- for sellers, the one that asks the least
- at the same price, the older order

A `PriorityQueue` with a `Comparator` does exactly this. For the buyers:

```java
Comparator.comparingInt((Order o) -> -o.price).thenComparingInt(o -> o.id)
```

`book` shows both sides, each with the best first:

```text
Sell:
  103 x 5  (Eva, order 2)
  103 x 8  (Leo, order 3)
  105 x 10  (Dan, order 1)
Buy:
  100 x 4  (Ida, order 4)
```

A `PriorityQueue` only keeps its best order at the front. To list all of them in order, copy them into a list and sort it with the same comparator.

## Matching

When a new order comes, it first trades with the best orders on the other side, as long as the prices agree:

- a buy trades with sellers who ask no more than its price
- a sell trades with buyers who pay no less than its price

The trade is at the price of the order that was already waiting:

```text
buy Mara 12 104
Order 5: Mara buys 12 at 104
  Trade: 5 at 103, Mara buys from Eva
  Trade: 7 at 103, Mara buys from Leo
```

An order that doesn't trade at all goes into the book.

## Bits and pieces

The quantities are almost never the same. A trade is for the smaller of the two quantities. The order with nothing left leaves the book (or never goes in), and the other one keeps what is left. Leo's 8 shares above are now 1 in the book.

A new order with some shares left after its trades goes into the book with them, and says so: `  4 left in the book`.

One more rule: nobody trades with themselves. When the best waiting order is from the same trader as the new order, the old order is cancelled first: `  Order 4 cancelled, Ida can't trade with themselves`.

## Cancel and market orders

- `cancel <order>` takes an order out of the book: `Order 4 cancelled`. If it is not in the book, print `No order 4 in the book`
- `market <trader> <buy|sell> <quantity>` trades at any price the book has, the best first, until it has all its shares: `Order 7: Mara buys 20 at any price`. A market order never waits in the book. What it can't get is dropped: `  5 not filled, nobody left to trade with`

## Who owns what

Every trader starts with 0 shares and 0 cash. Buying adds shares and takes away cash, and selling does the opposite. Both can go below 0: it is a game. For one share, write `1 share`.

`traders` lists everyone who made an order, by name:

```text
Dan: 0 shares, cash 0
Ida: -20 shares, cash 1980
```

`stats` shows the price of the last trade, how many shares were traded, and the average price paid, with two decimals. Before any trade, it prints `No trades yet`.

Last, wrong input:

- `buy`, `sell`, `market` and `cancel` with the wrong words print how to use them: `Usage: buy <trader> <quantity> <price>`, and so on
- a number that is not a number prints `Not a number: ten`
- 0 or less prints `Quantities and prices are whole numbers above 0`

The teacher doesn't need the whiteboard any more.
