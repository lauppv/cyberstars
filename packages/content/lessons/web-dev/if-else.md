A boolean on its own only answers a question. With `if`, the program **acts** on the answer: one thing when it's true, another when it's false.

## if and else

```js
const crates = 40;

if (crates > 50) {
  console.log("The bay is full");
} else {
  console.log("There's room for more");
}
```

The condition goes in parentheses. When it's `true`, the first block runs; otherwise the `else` block does. Exactly one of the two runs, never both. The `else` part is optional: without it, nothing happens when the condition is false.

## Conditions

Anything that gives a boolean can be a condition: a comparison, a boolean variable, a combination with `&&` and `||`.

```js
const isOpen = status === "Open";
if (isOpen && crates < 50) {
  console.log("Bring the crates in");
}
```

## Truthy and falsy

An `if` also takes values that aren't booleans. `0`, `""` (an empty string), `null`, `undefined` and `NaN` count as false, they're **falsy**; everything else counts as true. That's handy: `if (element)` is true when `querySelector` found something. But it can surprise you, since `0` crates is falsy, so prefer a clear comparison when you mean a number.

---

## Mission: Gate Message

- Under the boarding paragraph, add an empty paragraph with the id `gate-message`.
- If the first flight is boarding, it says `Now boarding: ` and that flight's code, `Now boarding: SL-101`. Otherwise it says `No flight is boarding yet`.
