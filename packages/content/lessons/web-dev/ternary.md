"1 flights" sounds wrong. So does "3 flight". The word changes with the number: one flight, two flights. It's a tiny choice between two words, and writing a whole `if` and `else` for it feels like too much.

## `? :`

The **ternary** makes a choice between two values in one line:

```js
const count = 1;
const word = count === 1 ? "flight" : "flights";
console.log(`${count} ${word}`);
```

```text
1 flight
```

Read it as a question: "is `count` 1? If yes, `"flight"`. If not, `"flights"`."

- the question comes first, then `?`;
- then the value for `true`;
- then `:` and the value for `false`.

The whole thing **is** a value, so it can go wherever a value goes, even inside a template:

```js
console.log(`${count} ${count === 1 ? "flight" : "flights"}`);
```

## Ternary or `if`?

- Choosing between two **values**: a ternary. Short and clear.
- Choosing between two **things to do**, several lines each: `if` and `else`.

If a ternary doesn't fit on one line, or has ternaries inside it, use `if`.

## Break it on purpose

Swap the two values:

```js
const word = count === 1 ? "flights" : "flight";
```

"1 flights", "3 flight": backwards. The value for `true` always comes right after the `?`.

---

## Mission: How many cancelled

The schedule page says how many flights are cancelled, in good English.

**Example**: under the gate message, a paragraph says:

```text
1 flight cancelled
```

And with two cancelled flights on the board, `2 flights cancelled`.

- Under `#gate-message`, a paragraph with the id `flight-count`.
- It says how many rows of the flight table's body have the class `cancelled`, then `flight` or `flights`, then ` cancelled`.

Psst, the value for `true` comes right after the `?` :)
