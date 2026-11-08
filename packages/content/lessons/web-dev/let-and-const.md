Typing a number straight into `console.log` is fine once. But a program needs to keep values, give them names and change them. That's what **variables** are for.

## const

```js
const baysTotal = 4;
console.log("Bays:", baysTotal);
```

`const` makes a **constant**: a name, `baysTotal`, for a value, `4`. Wherever the program says `baysTotal`, it means 4. A constant can't get another value later. If you try, the script stops with an error.

## let

```js
let cratesInBay = 40;
cratesInBay = cratesInBay - 5;
console.log("Crates left:", cratesInBay);
```

```text
Crates left: 35
```

`let` makes a **variable**: a name whose value can change. Read the second line from right to left: take the value of `cratesInBay`, take away 5, and put the result back into `cratesInBay`. Here `=` doesn't mean "equals". It means "now holds".

You write `let` or `const` only once, when you make the name. After that, you use the name alone.

## Which one

Use `const`, unless the value will change. Then use `let`. When code uses `const` a lot, you can see at a glance which values never change.

In older code you'll see `var`. It's an old version of `let` that behaves in surprising ways. Don't use it.

## Names

A name is made of letters, digits, `_` and `$`, and it can't start with a digit. When a name has several words, you join them and start each new word with a capital letter: `cratesInBay`, `baysTotal`. That's called **camelCase**. Pick names that say what the value is: `cratesInBay` is much better than `c` or `x2`.

---

## Mission: Crew Count

The number of people on board changes whenever a ship docks. Under your system check, in `script.js`:

- Keep the number of crew on board in your script. It starts at 6.
- Then a ship docks with two new crew members. Raise the count by 2, starting from the value it already has: don't type 8 yourself.
- Log the new count, so the console shows `Crew on board: 8`.
- Keep the minutes one orbit takes, 92, too. That value never changes. Log `Minutes per orbit: 92`.

Pick `let` or `const` for each value. If you pick wrong, the console will tell you.
