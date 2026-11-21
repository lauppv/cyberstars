A list comprehension with round brackets instead of square ones makes a **generator expression**: a small generator in one line. It hands out its values one at a time, like the generators from the last lesson, without building a list first

---

The only difference in how it looks is the brackets

```py
numbers = [1, 2, 3, 4]
as_list = [n * n for n in numbers]
as_generator = (n * n for n in numbers)
print(as_list)
print(list(as_generator))
```

Output

```text
[1, 4, 9, 16]
[1, 4, 9, 16]
```

Printing the generator itself would show something like `<generator object ...>`, not the values. Like every generator, it has values only when someone asks for them, and only once

---

Generator expressions shine inside functions that go through values one by one: `sum()`, `max()`, `min()`, `any()` and `all()`. When the generator expression is the only thing in the call, we can even drop its own brackets

```py
prices = [4, 10, 25]
counts = [3, 0, 2]
print(sum(p * c for p, c in zip(prices, counts)))
print(max(len(word) for word in ["sun", "comet", "moon"]))
```

Output

```text
62
5
```

`sum()` gets each product as it's made and adds it up. No list of products is ever built

---

`any()` gives True when at least one value is true, and `all()` when every value is. With a generator expression, they also stop as soon as the answer is clear

```py
temperatures = [21, 35, 19]
print(any(t > 30 for t in temperatures))
print(all(t > 20 for t in temperatures))
```

Output

```text
True
False
```

`any()` stops at 35: one hot reading is enough to answer True. It never looks at 19

---

Why does it matter that no list is built? For a few values it doesn't. For millions it does: a list keeps every value in memory at once, while a generator keeps only the one it's working on

```py
print(sum(n for n in range(1, 1000001)))
```

Output

```text
500000500000
```

Here a million numbers are added, but only one of them exists at any moment

---

## Mission: Order Check

The station shop gets an order: a list of prices and a list of how many of each item the customer wants. The shop checks the order before it's packed

1. Start your program with two variables: **prices** and **counts**, two lists of whole numbers of the same length. For example `prices = [4, 10, 25]` and `counts = [3, 0, 2]`
2. Print `Total: ` and the total price of the order: each price times its count, all added up
3. Print `Biggest line: ` and the biggest price times count of a single item
4. Print `Empty lines: ` and True if at least one item has a count of 0, or False if none has
5. Print `All cheap: ` and True if every item that is ordered, with a count above 0, costs less than 20, or False if not. An order where nothing is ordered counts as True

Use generator expressions, not lists. The lists have from 1 to 20 items, prices from 1 to 500 and counts from 0 to 10

**Example** for prices = [4, 10, 25] and counts = [3, 0, 2]

```text
Total: 62
Biggest line: 50
Empty lines: True
All cheap: False
```
