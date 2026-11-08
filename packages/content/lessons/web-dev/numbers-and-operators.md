The crew page gets a script of its own now, and its first job is math.

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

`%` gives the **remainder**, and it's more useful than it looks: `minutes % 60` is the minutes left over after the whole hours, and `n % 2` is 0 when `n` is even.

Like in math class, `*`, `/` and `%` come before `+` and `-`: `2 + 3 * 4` is 14. Parentheses come first of all: `(2 + 3) * 4` is 20.

## Rounding

`Math` has tools for numbers:

```js
Math.floor(13.8); // 13, down
Math.ceil(13.2); // 14, up
Math.round(13.5); // 14, to the nearest
Math.max(4, 9, 2); // 9
Math.min(4, 9, 2); // 2
```

For example, `Math.floor(minutes / 60)` is the number of whole hours in some minutes.

## Numbers from the page

Text you read from the page is always a **string**, even when it looks like a number. `"13" + 1` sticks them together: `"131"`. Turn it into a number first:

```js
const count = Number(document.querySelector("#crate-count").textContent);
```

`Number("13")` is `13`. `Number("thirteen")` is `NaN`, which means "not a number". When you see `NaN`, something that wasn't a number got into a calculation.

This lesson added an empty `crew.js` for the crew page.

---

## Mission: Oxygen Check

The crew needs to know how long the oxygen will last. On `crew.html`, after the duty board:

- a section called **Supplies**, with a sentence that says how many oxygen tanks are on board and how many hours each one lasts: **Oxygen tanks: 13, each lasting 30 hours.** Put the two numbers in elements with the ids `tanks` and `tank-hours`, without breaking the sentence, so the script can read them;
- an empty paragraph with the id `oxygen`.

Link `crew.js` to the crew page, so it runs once the page has been read. Your script works out how many hours of oxygen there are in all, logs that number, and writes in the oxygen paragraph how long it lasts, in whole days and the hours left over: `Oxygen for 16 days and 6 hours`. When the numbers on the page change, the sentence changes with them.
