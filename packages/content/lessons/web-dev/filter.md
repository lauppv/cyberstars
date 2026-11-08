"Every flight that is on time", "every crate over 100 kg", "every unread message": picking some items of an array happens so often that arrays have a method for it.

## filter

```js
const heavy = crates.filter((crate) => crate.weight > 100);
```

`filter` calls the function you give it once for each item. It builds a **new** array with the items for which the function returned `true`. The original array doesn't change.

The function is an arrow function with one parameter, the item: `(crate) => crate.weight > 100`. When an arrow function only has one expression, you can leave out the braces and the `return`: the expression's value is returned.

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

`filter` and `map` are often used together: first pick the items, then take what you need from them.

```js
const heavyNames = crates.filter((c) => c.weight > 100).map((c) => c.name);
```

The function you give `filter` can hold any condition that gives a boolean, even a whole `&&` or `||`. What it returns for an item decides whether that item stays.

---

## Mission: Gate Screens

Passengers waiting at the gate don't read the whole board. Their screens show two lines, under the destinations:

- a paragraph with the id `on-time`: the codes of the flights leaving on time, in the board's order, `On time: SL-102, SL-105`. With none, `On time: none`;
- under it, a paragraph with the id `before-ten`: the flights that still leave before 10:00, so any status but cancelled, each as its code and destination, `Before 10:00: SL-101 to Moon Base, SL-102 to Mars Relay, SL-103 to Europa Outpost`. With none, `Before 10:00: none`.

Both lines follow the table, whatever flights it holds. The board writes every time as `HH:MM`, with two digits for the hour and two for the minutes. Think about what that lets you do when you compare two times.
