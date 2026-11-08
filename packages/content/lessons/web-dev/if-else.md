A boolean on its own only answers a question. With `if`, the program **does something** with the answer: one thing when it's true, another when it's false.

## if and else

```js
const crates = 40;

if (crates > 50) {
  console.log("The bay is full");
} else {
  console.log("There's room for more");
}
```

The condition goes in parentheses. When it's `true`, the first block runs. Otherwise, the `else` block runs. Exactly one of the two runs, never both. The `else` part is optional: without it, nothing happens when the condition is false.

## Conditions

Anything that gives a boolean can be a condition: a comparison, a boolean variable, a combination with `&&` and `||`.

```js
const isOpen = status === "Open";
if (isOpen && crates < 50) {
  console.log("Bring the crates in");
}
```

## Truthy and falsy

An `if` also takes values that aren't booleans. `0`, `""` (an empty string), `null`, `undefined` and `NaN` count as false: they're called **falsy**. Everything else counts as true. That's handy: `if (element)` is true when `querySelector` found something. But it can surprise you, because `0` crates is falsy too. When you mean a number, write a clear comparison.

---

## Mission: Gate Message

The screen at the gate tells passengers what to do.

- Under the boarding paragraph, add an empty paragraph with the id `gate-message`.
- When the first flight is boarding, it says `Now boarding: ` and that flight's code: `Now boarding: SL-101`. When it isn't, it says `No flight is boarding yet`. Both must work, whatever the table holds.
