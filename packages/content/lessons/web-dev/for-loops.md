"Write 'I will not talk in class' 100 times." A computer would love that punishment. Repeating something is what computers are best at, and a **loop** is how you ask for it, without writing the same line 100 times.

## A `for` loop

```js
for (let i = 1; i <= 3; i++) {
  console.log("Lap", i);
}
```

```text
Lap 1
Lap 2
Lap 3
```

The lines between `{` and `}` run again and again. The first line says how many times, in three parts separated by `;`:

1. `let i = 1`: **start** with a counter, `i`, at 1;
2. `i <= 3`: **keep going** while `i` is smaller than or equal to 3. `<=` means "smaller than or equal to";
3. `i++`: **after each lap**, add 1 to `i`. `i++` is short for `i = i + 1`.

So: `i` is 1, the lap runs; `i` becomes 2, it runs; `i` becomes 3, it runs; `i` becomes 4, and 4 isn't `<= 3`, so the loop stops.

## Counting down

The counter can go the other way:

```js
for (let i = 3; i >= 1; i--) {
  console.log(i);
}
console.log("Go!");
```

```text
3
2
1
Go!
```

Start at 3, keep going while `i >= 1` (bigger than or equal to 1), and `i--` takes 1 away each lap. The `Go!` line is after the `}`, so it runs once, when the loop is done.

## Break it on purpose

Use `<` instead of `<=`:

```js
for (let i = 1; i < 3; i++) {
  console.log("Lap", i);
}
```

Only 2 laps: when `i` is 3, `3 < 3` is false, so lap 3 never runs. "Less than" or "less than or equal": one character, one lap.

---

## Mission: Launch countdown

The station's shuttle launches from a countdown.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
5
4
3
2
1
Liftoff!
```

- The console shows the numbers 5, 4, 3, 2 and 1, each on its line, written by one loop.
- After them, it shows `Liftoff!`, once.

Psst, a line after the loop's `}` runs only once :)
