Numbers typed straight into a `console.log` are fine once. A program needs to keep values, give them names and change them. That's what **variables** are for.

## const

```js
const baysTotal = 4;
console.log("Bays:", baysTotal);
```

`const` makes a **constant**: a name, `baysTotal`, for a value, `4`. Wherever the program says `baysTotal`, it means 4. A constant can't be given another value later: try, and the script stops with an error.

## let

```js
let cratesInBay = 40;
cratesInBay = cratesInBay - 5;
console.log("Crates left:", cratesInBay);
```

```text
Crates left: 35
```

`let` makes a **variable**, whose value can change. The second line reads right to left: take `cratesInBay`'s value, take away 5, and put the result back into `cratesInBay`. The `=` doesn't say "equals", it says "now holds".

`let` and `const` come only the first time, when the name is made. After that, the name alone.

## Which one

Use `const` unless the value will change, and `let` when it will. Reading code full of `const`, you know at a glance what stays put.

You'll see `var` in older code: an older `let`, with surprises of its own. Don't write it.

## Names

A name is letters, digits, `_` and `$`, and doesn't start with a digit. When it has several words, they're joined with each new word in a capital: `cratesInBay`, `baysTotal`. That's called **camelCase**. Pick names that say what the value is: `cratesInBay` beats `c` or `x2`.

---

## Mission: Crew Count

Under your system check, in `script.js`:

- a constant for the minutes per orbit, `92`;
- a variable for the crew on board, `6`;
- two new crew members dock: add 2 to the crew variable, by its own value;
- log `Crew on board:` and the variable: the console shows `Crew on board: 8`;
- log `Minutes per orbit:` and the constant.
