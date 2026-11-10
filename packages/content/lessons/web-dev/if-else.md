"If it's colder than 15 degrees, I take a jumper. Otherwise, a t-shirt is enough." You make choices like that every day, without thinking. A program can make them too: do one thing **if** something is true, and another thing **else**.

## `if`

```js
const temperature = 12;
if (temperature < 15) {
  console.log("Take a jumper");
}
```

```text
Take a jumper
```

The question goes in the brackets after `if`. When its answer is `true`, the lines between `{` and `}` run. When it's `false`, they're skipped.

## `else`

`else` says what to do when the answer is `false`:

```js
const temperature = 20;
if (temperature < 15) {
  console.log("Take a jumper");
} else {
  console.log("A t-shirt is enough");
}
```

```text
A t-shirt is enough
```

Exactly one of the two blocks runs, never both, never neither.

## On the page

The question can come from the page, and the answer go back to it:

```js
const open = document.querySelector("#open").textContent === "Yes";
if (open) {
  document.querySelector("#note").textContent = "Come on in!";
} else {
  document.querySelector("#note").textContent = "See you tomorrow";
}
```

## Break it on purpose

Put a `;` after the brackets:

```js
if (temperature < 15); {
  console.log("Take a jumper");
}
```

"Take a jumper" shows even at 30 degrees. The `;` ends the `if` right there, with nothing to do, and the block after it is just a block that always runs. No `;` between an `if`'s brackets and its `{`.

---

## Mission: Now boarding

The schedule page says which flight is boarding now.

**Example**: under the flight table, a paragraph says:

```text
Now boarding: SL-101
```

And when the first flight isn't boarding, it says `Nobody is boarding yet`.

- Under the flight table, a paragraph with the id `boarding-now`.
- If the first row's status is `Boarding`, it says `Now boarding: ` and that row's flight code.
- Else, it says `Nobody is boarding yet`.

Psst, exactly one of the two blocks runs :)
