Most loops over an array don't need the index at all, only each value in turn. For those, JavaScript has a shorter loop.

## for...of

```js
const weights = [120, 80, 45];
let total = 0;
for (const weight of weights) {
  total += weight;
}
console.log(total); // 245
```

Read it as "for each weight of weights". Each round, `weight` holds the next value, from the first to the last. No counter, no `length`, no off-by-one. It's `const` because within one round it doesn't change; the next round gets a fresh one.

It works on a NodeList from `querySelectorAll` too:

```js
for (const item of document.querySelectorAll("#manifest li")) {
  console.log(item.textContent);
}
```

## Which loop

- **`for...of`** when you want every value, in order. Most of the time.
- **`for` with a counter** when you need the index, a different step, going backwards, or a count with no array at all, like your countdown.

## Adding up

The pattern above, a total that starts at 0 and grows by one value per round, is one you'll write again and again: totals, counts, the biggest value so far. An average is the total divided by how many values there were.

---

## Mission: Logged Hours

- On every crew card, add a paragraph with the hours that crew member worked this week, the number in a span in the class `worked`: `Hours this week: <span class="worked">36</span>`. Pick the numbers yourself.
- After the box of cards, add an empty paragraph with the id `hours-total`.
- In `crew.js`, with a `for...of` loop over the hours on the page, work out the total and the average, rounded to a whole number, and write them in that paragraph: `Hours this week: 142, about 36 per crew member`.
