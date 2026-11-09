At the end of a shopping trip, the cashier adds up every item: 2 euros, plus 3, plus 1.50... A running total that starts at 0 and grows with each item. A loop can keep a running total the same way.

## A total that grows

```js
const prices = [2, 3, 1.5];
let total = 0;
for (const price of prices) {
  total = total + price;
}
console.log(total);
```

```text
6.5
```

It's the same idea as building a string, with numbers:

- `let total = 0`: start at **zero**, before the loop;
- each lap, `total = total + price`: add this item to what you have so far;
- after the loop, `total` is the sum of everything.

Lap by lap: 0 + 2 = 2, then 2 + 3 = 5, then 5 + 1.5 = 6.5.

## From the page

Numbers on the page are text, so each one goes through `Number()` before it's added:

```js
let total = 0;
for (const price of document.querySelectorAll(".price")) {
  total = total + Number(price.textContent);
}
```

## Break it on purpose

Forget the `Number()`:

```js
total = total + price.textContent;
```

With prices 2, 3 and 1.5 on the page, the total comes out as `"0231.5"`... a string! `0 + "2"` joins instead of adding, and from then on everything is stuck on. When a total looks like a row of digits glued together, a `Number()` is missing.

---

## Mission: Hours this week

Every crew card shows how many hours that person worked this week, and the page adds them all up.

**Example**: each card shows a line like `Hours this week: 12`, and under the cards the page shows:

```text
Crew hours this week: 61
```

- Every card has a paragraph `Hours this week: ` with the number in a `span` with the class `worked`.
- Under the cards, a paragraph with the id `hours-total` says `Crew hours this week: ` and the sum of every card's hours.
- The sum is worked out from the cards, so changing a card's hours changes the total.

Psst, start the total at 0, before the loop :)
