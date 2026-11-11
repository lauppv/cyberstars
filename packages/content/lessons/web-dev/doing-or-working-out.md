In a kitchen, one person might work out how many eggs a cake needs for 12 guests, and another bakes it. Working something out and doing something are two different jobs. Functions are clearer when each does one of them.

## Two kinds of function

A function that **does** something changes the page, or logs, and returns nothing:

```js
function showTotal(total) {
  document.querySelector("#total").textContent = `Total: ${total}`;
}
```

A function that **works something out** returns an answer, and changes nothing:

```js
function addUp(prices) {
  let total = 0;
  for (const price of prices) {
    total = total + price;
  }
  return total;
}
```

Then they work together:

```js
showTotal(addUp([2, 3, 1.5]));
```

`addUp` works out 6.5, and `showTotal` puts it on the page.

## Why split them?

Because an answer can be used in more than one place. `addUp` can feed the page **and** the console, or another sum, like an average:

```js
const prices = [2, 3, 1.5];
console.log("Average:", addUp(prices) / prices.length);
```

If `addUp` also wrote on the page, using it here would scribble over the page every time. A function that only works things out can be called anywhere, as often as you like, without surprises.

A good test: can you describe the function without "and"? "Adds up the prices" is one job. "Adds up the prices and shows them" is two.

## Break it on purpose

Make `addUp` show the total itself, and return nothing. Now `addUp(prices) / prices.length` is `undefined / 3`: `NaN`. The function did its showing, but had no answer to give.

---

## Mission: An average

The crew's hours are added up for `#hours-total`. Now the console also wants the average per crew member, from the same sum.

**Example**: when `crew.html` opens, the page shows `Crew hours this week: 61` as before, and the console shows, among its other lines:

```text
Average hours per crew member: 15.25
```

- A function returns the sum of the hours on the cards, and changes nothing on the page.
- `#hours-total` shows that sum, as before.
- The console shows `Average hours per crew member: ` and the sum divided by the number of cards.

Psst, a function that works something out uses `return` :)
