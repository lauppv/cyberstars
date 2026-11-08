The crew page gets a script of its own now, and its first job is arithmetic.

## Operators

```js
const crates = 40;
console.log(crates + 8); // 48
console.log(crates - 8); // 32
console.log(crates * 3); // 120
console.log(crates / 3); // 13.333333333333334
console.log(crates % 3); // 1, what's left after dividing by 3
console.log(2 ** 3); // 8, 2 to the power of 3
```

`%`, the **remainder**, is more useful than it looks: `minutes % 60` is the minutes left once the whole hours are counted, `n % 2` is 0 for an even number.

As in maths, `*`, `/` and `%` go before `+` and `-`: `2 + 3 * 4` is 14. Parentheses go first of all: `(2 + 3) * 4` is 20.

## Rounding

`Math` holds number tools:

```js
Math.floor(13.8); // 13, down
Math.ceil(13.2); // 14, up
Math.round(13.5); // 14, to the nearest
Math.max(4, 9, 2); // 9
Math.min(4, 9, 2); // 2
```

`Math.floor(minutes / 60)` is the whole hours in some minutes.

## Numbers from the page

Text read from the page is always a **string**, even when it looks like a number. `"13" + 1` glues: `"131"`. Turn it into a number first:

```js
const count = Number(document.querySelector("#crate-count").textContent);
```

`Number("13")` is `13`. `Number("thirteen")` is `NaN`, "not a number": when you see `NaN`, something that wasn't a number got into a calculation.

This lesson brought an empty `crew.js` for the crew page.

---

## Mission: Oxygen Check

On `crew.html`, after the duty board:

- a section heading **Supplies**, and under it a paragraph that says how many oxygen tanks are on board and how many hours each lasts, with the two numbers in spans with the ids `tanks` and `tank-hours`: `Oxygen tanks: <span id="tanks">13</span>, each lasting <span id="tank-hours">30</span> hours.`;
- an empty paragraph with the id `oxygen`.

Link `crew.js` to the crew page, deferred. In it:

- read the two numbers from the page and work out how many hours of oxygen there are in all; log that number;
- write in the oxygen paragraph how long that is in whole days and the hours left over: with 13 tanks of 30 hours, `Oxygen for 16 days and 6 hours`.

If the numbers on the page change, the sentence follows them.
