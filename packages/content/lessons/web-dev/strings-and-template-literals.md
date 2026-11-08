Most of what a page shows is text, so most of what its scripts handle is **strings**.

## Joining strings

`+` between two strings glues them together:

```js
const bay = "Cargo Bay";
console.log("Welcome to " + bay);
```

```text
Welcome to Cargo Bay
```

Mind the space: `"Welcome to" + bay` gives `Welcome toCargo Bay`. With numbers, `+` adds; with a string and a number, it glues: `"Bay " + 2` is `"Bay 2"`.

## Template literals

Gluing many pieces with `+` gets hard to read. A **template literal** is a string between backticks, `` ` ``, with values dropped right into it:

```js
const crates = 40;
console.log(`${bay} holds ${crates} crates`);
```

```text
Cargo Bay holds 40 crates
```

`${ }` takes any value, or a calculation: `` `${crates * 2} after the delivery` ``. It works only between backticks: in `"..."` or `'...'`, `${bay}` is just those six characters.

## What a string knows

A string carries facts and tools of its own, reached with a dot:

```js
bay.length; // 9, the number of characters, spaces included
bay.toUpperCase(); // "CARGO BAY"
bay.toLowerCase(); // "cargo bay"
```

`length` is a fact, so no parentheses; `toUpperCase()` is a tool, a **method**, so it has them. The original string doesn't change: `toUpperCase()` gives back a new one.

## Quotes inside quotes

A string in double quotes can hold single ones, and the other way round: `"Bay 2's door"`. Backticks hold both.

---

## Mission: Greeting Board

Under the crew count, in `script.js`:

- a constant with the station's name, `Station Log`;
- with a template literal and that constant, log `Welcome aboard Station Log`;
- log how many characters the name has, read from the constant;
- log the name in capitals, made from the constant;
- with a template literal and your minutes constant, log `One orbit takes 92 minutes`.
