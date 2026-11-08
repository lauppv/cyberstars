Some questions have more than two answers. A flight can be on time, boarding, delayed or cancelled.

## else if

```js
if (crates > 50) {
  console.log("Full");
} else if (crates > 20) {
  console.log("Half full");
} else if (crates > 0) {
  console.log("Almost empty");
} else {
  console.log("Empty");
}
```

The conditions are checked from the top, and the **first** one that's true runs its block. The rest are skipped. So the order matters: with 60 crates, `crates > 20` is true too, but `crates > 50` comes first. The last `else` catches everything that no condition matched.

## The ternary operator

For choosing between two **values**, there's a short form:

```js
const label = crates === 1 ? "crate" : "crates";
console.log(`${crates} ${label}`);
```

`condition ? valueIfTrue : valueIfFalse`. It gives back one of the two values, so it fits inside a template literal or after an `=`. Use it for short choices like this one. Anything longer is easier to read as an `if`.

---

## Mission: Flight Notes

Two more lines for the gate screen. Under the gate message, add empty paragraphs with the ids `first-flight-note` and `flight-count`.

- The first one gives passengers advice by the first flight's status: `On schedule` for `On time`, `Go to the gate` for `Boarding`, `Running late` for `Delayed`, `Grounded` for `Cancelled`, and `Check the board` for anything else.
- The second says how many flights are in the table's body, and gets its English right: `5 flights today`, but `1 flight today`.
