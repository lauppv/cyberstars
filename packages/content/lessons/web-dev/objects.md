A flight isn't one value: it's a code, a destination, a time and a status, all belonging together. An **object** keeps them together, each one under its own name.

## Making an object

```js
const crate = {
  name: "Water",
  weight: 120,
  fragile: false,
};
```

Curly braces, and inside them **properties**: a name, a colon and a value, with commas between them. The values can be anything: strings, numbers, booleans, arrays, even other objects.

## Reading and changing

```js
crate.name; // "Water"
crate["weight"]; // 120
crate.weight = 115; // change it
crate.bay = 2; // add a new property
```

The **dot** is the usual way. **Square brackets** take the name as a string, which is useful when the name is kept in a variable: `crate[field]`. A property that doesn't exist reads as `undefined`.

Like an array, a `const` object can still change inside. `const` only means the name always points to the same object.

## Why bother

`crate.weight` says what it is. With separate variables like `crateName`, `crateWeight` and `crateFragile`, nothing ties them together, and giving a crate to a function means giving it three things. An object is one thing you can pass around, return or keep in an array.

You've been using objects all along: `document`, `console`, `Math` and every element are objects, with properties (`textContent`, `length`) and methods (`log`, `querySelector`).

---

## Mission: Next Flight

The gate screen describes the first flight in one sentence.

- Under the active count, add an empty paragraph with the id `next-flight`.
- Keep the first flight of the table together in your script, with its `code`, `destination`, `departs` and `status` read from its cells.
- The paragraph says `SL-101 to Moon Base at 08:30`, built from those four values, and follows the table.
- The console shows `Status: Boarding`, the flight's status. Try reading it with square brackets this time.
