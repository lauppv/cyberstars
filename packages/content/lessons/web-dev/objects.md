A flight isn't one value: it's a code, a destination, a time and a status, all belonging together. An **object** keeps them together, each under a name.

## Making an object

```js
const crate = {
  name: "Water",
  weight: 120,
  fragile: false,
};
```

Curly braces, then **properties**: a name, a colon, a value, separated by commas. The values can be anything: strings, numbers, booleans, arrays, even other objects.

## Reading and changing

```js
crate.name; // "Water"
crate["weight"]; // 120
crate.weight = 115; // change it
crate.bay = 2; // add a new property
```

The **dot** is the usual way. **Square brackets** take the name as a string, which is useful when the name is in a variable: `crate[field]`. A property that doesn't exist reads as `undefined`.

Like an array, a `const` object can still change inside; `const` only means the name always points to the same object.

## Why bother

`crate.weight` says what it is. With separate variables, `crateName`, `crateWeight`, `crateFragile`, nothing ties them together, and passing a crate to a function means passing three things. An object is one thing to pass, return, keep in an array.

You've used objects all along: `document`, `console`, `Math` and every element are objects, with properties (`textContent`, `length`) and methods (`log`, `querySelector`).

---

## Mission: Next Flight

- Under the active count, add an empty paragraph with the id `next-flight`.
- Build an object for the first flight of the table, with the properties `code`, `destination`, `departs` and `status`, read from its cells.
- Write in the paragraph `SL-101 to Moon Base at 08:30`, made from the object's properties.
- Log `Status:` and the flight's status, read with square brackets.
