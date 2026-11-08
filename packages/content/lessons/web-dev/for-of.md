Most loops over an array don't need the index at all. They only need each value, one after the other. For those, JavaScript has a shorter loop.

## for...of

```js
const weights = [120, 80, 45];
let total = 0;
for (const weight of weights) {
  total += weight;
}
console.log(total); // 245
```

Read it as "for each weight of weights". In each round, `weight` holds the next value, from the first to the last. No counter, no `length`, no being off by one. It's `const` because it doesn't change during a round: the next round gets a new one.

It works on a NodeList from `querySelectorAll` too:

```js
for (const item of document.querySelectorAll("#manifest li")) {
  console.log(item.textContent);
}
```

## Which loop

- **`for...of`** when you want every value, in order. That's most of the time.
- **`for` with a counter** when you need the index, a different step, going backwards, or counting without an array, like your countdown.

## Adding up

The pattern above is one you'll write again and again: a total starts at 0 and grows by one value in each round. You'll use it for totals, counts, or the biggest value so far. An average is the total divided by how many values there were.

---

## Mission: Logged Hours

The station's doctor wants to know how hard the crew works.

- On every crew card, add the hours that crew member worked this week, like **Hours this week: 36**, with the number in an element in the class `worked`, inside its sentence. Pick the numbers yourself.
- After the box of cards, add an empty paragraph with the id `hours-total`. It shows the total of all the hours on the cards and the average per crew member, rounded to the nearest whole hour: `Hours this week: 142, about 36 per crew member`. It follows whatever the cards say.
