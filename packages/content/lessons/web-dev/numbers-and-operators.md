A calculator does sums for you: you type `12 × 4` and it says 48. JavaScript can be your calculator too, and better: it can do the sum with values it keeps under names, and use the answer on the page.

## The four sums

```js
console.log(12 + 4);
console.log(12 - 4);
console.log(12 * 4);
console.log(12 / 4);
```

```text
16
8
48
3
```

- `+` adds, `-` takes away;
- `*` multiplies: there's no × key, so it's a star;
- `/` divides.

They work on names too:

```js
const pizzas = 3;
const slicesEach = 8;
const slices = pizzas * slicesEach;
console.log(slices);
```

```text
24
```

As in maths, `*` and `/` go before `+` and `-`: `2 + 3 * 4` is 14, not 20. Brackets go first: `(2 + 3) * 4` is 20.

## `%`: what's left over

`%` isn't a percentage here. It gives the **remainder** of a division: what's left when you share out as many whole times as you can.

```js
console.log(25 % 8);
```

```text
1
```

25 slices shared between 8 people: 3 each makes 24, and 1 slice is left over. `%` says 1.

It's handy for anything that goes round in a circle: hours on a clock, days of a week.

## Break it on purpose

Add a number that's really a string:

```js
const slices = "24";
console.log(slices + 1);
```

```text
241
```

Not 25! With a string on one side, `+` joins instead of adding. Numbers you do maths with must be numbers, without quotes. (`*`, `-` and `/` would still work, which makes the mix-up harder to spot.)

---

## Mission: How long the oxygen lasts

Your `crew.js` keeps the number of oxygen tanks, 7, and how long each lasts, 20 hours. Work out how long they last together.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Oxygen lasts 140 hours
Hours past the last full day: 20
```

- The console shows `Oxygen lasts 140 hours`, worked out from the two names.
- The console shows `Hours past the last full day: 20`: what's left of those hours once every full day of 24 hours is taken out.

Psst, what's left over is `%` :)
