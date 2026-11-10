At a traffic light, there are three choices, not two: green, go; amber, slow down; red, stop. When there are more than two answers, one `if` and one `else` aren't enough. You need a chain.

## `else if`

```js
const light = "amber";
if (light === "green") {
  console.log("Go");
} else if (light === "amber") {
  console.log("Slow down");
} else {
  console.log("Stop");
}
```

```text
Slow down
```

The questions are asked from the top, one after another:

1. Is it green? No.
2. Is it amber? Yes: "Slow down". The rest is skipped.

As soon as one answer is `true`, its block runs and the chain ends. If none is true, the final `else` runs. You can have as many `else if`s as you need.

## The order matters

```js
const score = 95;
if (score >= 50) {
  console.log("Passed");
} else if (score >= 90) {
  console.log("Top marks");
}
```

```text
Passed
```

95 is "at least 90", but the first question, "at least 50?", already said yes, so the second one is never asked. Put the most specific question first.

## Break it on purpose

Write two separate `if`s instead of a chain:

```js
if (light === "green") {
  console.log("Go");
}
if (light === "amber") {
  console.log("Slow down");
} else {
  console.log("Stop");
}
```

With a green light, you get "Go" **and** "Stop": the second `if` is a new question, and its `else` runs because the light isn't amber. In a chain, only one block ever runs.

---

## Mission: Gate message

The schedule page tells passengers of the first flight what to do.

**Example**: under `#boarding-now`, a paragraph says what passengers of the first flight should do:

```text
Go to gate 3
```

- Under `#boarding-now`, a paragraph with the id `gate-message`.
- It depends on the first row's status: `Boarding` gives `Go to gate 3`, `Delayed` gives `Please wait`, `Cancelled` gives `Ask at the desk`, and any other status gives `Check the board`.

Psst, one chain, one `else` at the end :)
