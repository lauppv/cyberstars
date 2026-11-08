The schedule gets a script of its own, and its first questions have yes-or-no answers: is the first flight boarding? Is there a delay? JavaScript answers with **booleans**.

## true and false

A **boolean** is one of two values: `true` or `false`. Comparisons give them:

```js
40 > 25; // true
40 <= 25; // false
"Bay 2" === "Bay 2"; // true
"Bay 2" !== "Bay 3"; // true
```

`===` asks "is this exactly the same?", and `!==` asks "is it different?".

## === and ==

JavaScript also has `==`, a looser equals that converts values before comparing:

```js
"7" == 7; // true: the string is turned into a number first
"7" === 7; // false: a string isn't a number
"" == 0; // true, surprisingly
```

Those changes are full of surprises. Always use `===` and `!==`, and change the type yourself, with `Number()`, when you need to.

## and, or, not

- `a && b`, **and**: true only when both are.
- `a || b`, **or**: true when at least one is.
- `!a`, **not**: turns true into false and back.

```js
const crates = 40;
crates > 10 && crates < 50; // true: both hold
```

You can keep booleans in variables like any other value. Give them names that sound like questions: `isBoarding`, `hasDelays`.

This lesson added an empty `schedule.js`.

---

## Mission: Boarding Check

The gate staff want to know straight away if the first flight is boarding.

- Link `schedule.js` to `schedule.html`, so it runs once the page has been read. Under the flights table, add an empty paragraph with the id `boarding-now`.
- It answers with `true` or `false` whether the first flight in the table's body has the status `Boarding`, exactly: `First flight boarding: true` on your schedule. When the table changes, the answer changes with it.
- To see the difference between the two kinds of equals, the console shows:

```text
Loose: true
Strict: false
```

The first line is the result of `"7" == 7`, the second of `"7" === 7`. Let JavaScript work them out: don't type `true` and `false` yourself.
