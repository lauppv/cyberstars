The schedule gets a script of its own, and its first questions are yes-or-no ones: is the first flight boarding? Is a delay showing? JavaScript answers with **booleans**.

## true and false

A **boolean** is one of two values: `true` or `false`. Comparisons give them:

```js
40 > 25; // true
40 <= 25; // false
"Bay 2" === "Bay 2"; // true
"Bay 2" !== "Bay 3"; // true
```

`===` asks "is this exactly the same?", and `!==` "is it different?".

## === and ==

JavaScript also has `==`, a looser equals that converts values before comparing:

```js
"7" == 7; // true: the string is turned into a number first
"7" === 7; // false: a string isn't a number
"" == 0; // true, surprisingly
```

Those conversions are full of surprises. Always use `===` and `!==`, and convert yourself, with `Number()`, when you mean to.

## and, or, not

- `a && b`, **and**: true only when both are.
- `a || b`, **or**: true when at least one is.
- `!a`, **not**: turns true into false and back.

```js
const crates = 40;
crates > 10 && crates < 50; // true: both hold
```

Booleans can be kept in variables like any value. Name them as questions: `isBoarding`, `hasDelays`.

This lesson brought an empty `schedule.js`.

---

## Mission: Boarding Check

- Link `schedule.js` to `schedule.html`, deferred. Under the flights table, add an empty paragraph with the id `boarding-now`.
- In `schedule.js`, read the status of the first flight in the table's body, and keep in a variable whether it is exactly `Boarding`.
- Write in the paragraph `First flight boarding: ` and that boolean: `First flight boarding: true` on your schedule.
- Log `Loose:` and the result of `"7" == 7`, then `Strict:` and the result of `"7" === 7`.
