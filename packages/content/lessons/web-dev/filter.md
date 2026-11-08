"Every flight that is on time", "every crate over 100 kg", "every unread message": picking some items of an array is so common that arrays have a method for it.

## filter

```js
const heavy = crates.filter((crate) => crate.weight > 100);
```

`filter` calls the function you give it once for each item, and builds a **new** array of the items for which it returned `true`. The original array doesn't change.

The function is an arrow function with one parameter, the item: `(crate) => crate.weight > 100`. When an arrow function's body is a single expression, it can be written without braces and without `return`: the expression's value is returned.

```js
// the same, written out
const heavy = crates.filter((crate) => {
  return crate.weight > 100;
});
```

## Its cousins

Arrays have more methods that take a function:

- `map` builds a new array from each item: `crates.map((c) => c.name)` is the array of names.
- `find` gives back the **first** item that matches, or `undefined`.
- `some` is `true` when at least one item matches.

`filter` and `map` together are a classic: pick the items, then take what you need from them.

```js
const heavyNames = crates.filter((c) => c.weight > 100).map((c) => c.name);
```

---

## Mission: On Time

- Under the destinations, add an empty paragraph with the id `on-time`.
- With `filter`, pick the flights whose status is exactly `On time`, and write their codes in the paragraph, joined with `, `: `On time: SL-102, SL-105`. With none, `On time: none`.
