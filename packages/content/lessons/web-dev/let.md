Your phone's battery doesn't stay at 80% all day: it goes down as you use it, and up when you charge it. Some values are like that. They change while the program runs. For those, a `const` won't do.

## `let`

```js
let score = 0;
console.log("Score:", score);

score = 10;
console.log("Score:", score);
```

```text
Score: 0
Score: 10
```

`let` makes a name whose value **can** change. You write `let` once, when you make the name. After that, you use the name alone to give it a new value: `score = 10`, without `let`.

## Changing a value from what it was

Most of the time, the new value comes from the old one:

```js
let score = 10;
score = score + 5;
console.log("Score:", score);
```

```text
Score: 15
```

Read the second line from right to left: take what's in `score` (10), add 5, and put the result back in `score`. Now it holds 15.

## `let` or `const`?

Ask: will this value change while the script runs?

- No: `const`. The minutes in an orbit, a club's name.
- Yes: `let`. A score, a count of people, a battery level.

When in doubt, start with `const`. If you later need to change it, the console tells you, and you switch to `let`.

You may also see `var` in older code. It's an old way of writing `let`, with surprises of its own. Don't use it.

## Break it on purpose

Write `let` twice for the same name:

```js
let score = 0;
let score = 10;
```

A `SyntaxError`: the name already exists. Only the first time gets `let`.

---

## Mission: A ship docks

A supply ship has just docked, and two new crew members come aboard.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Crew on board: 4
Crew on board: 6
```

- The console shows `Crew on board: 4`, then `Crew on board: 6`.
- The number of crew is kept under one name. The script adds 2 to the value it already has, rather than typing 6.
- The console shows no errors.

Psst, a value that changes needs `let`, not `const` :)
