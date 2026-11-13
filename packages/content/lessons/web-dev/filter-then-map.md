Sorting the washing: first you pick out the white clothes from the basket, then you fold each of them. Two steps, one after the other, and each step works on what the step before left. Array methods can follow each other the same way.

## Two steps, two arrays

You know `filter`: it keeps the items for which its question answers `true`. And `map`: it changes every item. Here a class's test results, as objects:

```js
const results = [
  { name: "Mia", points: 92 },
  { name: "Leo", points: 48 },
  { name: "Sara", points: 75 },
];

const passed = results.filter((result) => result.points >= 50);
const names = passed.map((result) => result.name);
console.log(names);
```

```text
["Mia", "Sara"]
```

`filter` keeps the two results of 50 points or more. `map` then turns each of them into just the name.

## One after the other, in one line

`filter` gives back an array, and an array has `map`. So you can write the second method straight after the first, with a dot:

```js
const names = results.filter((result) => result.points >= 50).map((result) => result.name);
console.log(names);
```

```text
["Mia", "Sara"]
```

Read it from left to right: take the results, keep those with 50 points or more, then take their names. Each method works on what the one before it gave. You can add a third one too: `.join(", ")` makes one line of the names.

When the line gets long, put each method on a line of its own, starting with its dot:

```js
const line = results
  .filter((result) => result.points >= 50)
  .map((result) => result.name)
  .join(", ");
```

## The order matters

Swap the two methods:

```js
const names = results.map((result) => result.name).filter((result) => result.points >= 50);
console.log(names);
```

```text
[]
```

`map` runs first, so `filter` gets only names: `"Mia"`, `"Leo"`, `"Sara"`. A name has no `points`, so `result.points` is `undefined`, the question is never true, and nothing is kept. No error tells you: the array is just empty. Keep the information you still need until the step that needs it.

## Break it on purpose

Read the points from the page without `Number`: `"48" >= 50` still works, because comparing a text with a number turns the text into a number. But compare two texts, `"9" >= "50"`, and it's `true`: texts are compared letter by letter, and "9" comes after "5". Turn what you read from a page into a number with `Number` before you compare it.

---

## Mission: What runs low

The crew checks the supplies every morning. The dashboard should name the ones that are running low.

**Example**: after the wishes, a part such as "Supplies" with a table, then the line:

```text
Running low: Oxygen, Fuel
```

When no supply is low, it says:

```text
Running low: nothing
```

- After the wishes, a new part with a heading, a table with the id `supplies`, with a row for each supply (at least four): a cell with the class `item` for its name, and one with the class `level` for how full it is, as a number from 0 to 100. Then a paragraph with the id `low-supplies`.
- The script makes an array of the supplies from the table's rows, each one an object with its name and its level as a number.
- `#low-supplies` says `Running low: `, then the names of the supplies under 25, in the table's order, with a comma and a space between them. When there is none, `Running low: nothing`.

Psst, first keep the low ones, then take their names :)
