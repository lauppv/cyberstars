Ask a friend "what's 7 times 8?" and they answer "56". They don't write it on the wall: they hand the answer back to you, and you do what you like with it. A function can hand back an answer too, with `return`.

## `return`

```js
function double(number) {
  return number * 2;
}

const result = double(21);
console.log(result);
```

```text
42
```

`return` ends the function and hands a value back to wherever it was called. `double(21)` **becomes** 42, as if you'd written 42 there. You can keep it in a name, log it, or use it in a sum:

```js
console.log(double(5) + 1);
```

```text
11
```

## The function stops at `return`

```js
function double(number) {
  return number * 2;
  console.log("Done");
}
```

`"Done"` is never logged. `return` leaves the function at once, so lines after it never run.

## Break it on purpose

Forget the `return`:

```js
function double(number) {
  number * 2;
}
console.log(double(21));
```

```text
undefined
```

The function works out 42... and keeps it to itself. Without `return`, a function hands back `undefined`, "nothing". If a function's answer comes out as `undefined`, look for a missing `return`.

---

## Mission: Days of oxygen on the page

The page already works out how many hours the oxygen lasts. Now it also says how many full days that is, with a function that turns hours into days.

**Example**: under the oxygen line, the page shows:

```text
Oxygen for 5 full days
```

- A function, named by you, takes a number of hours and returns how many full days of 24 hours they make.
- A paragraph with the id `oxygen-days`, under `#oxygen`, says `Oxygen for `, the days your function returns for the oxygen's hours, and ` full days`.
- The hours come from the numbers on the page.

Psst, a function's answer comes back through `return` :)
