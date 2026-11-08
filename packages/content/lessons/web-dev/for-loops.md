Arrays hold many values. A **loop** does something with each of them, or repeats something a number of times, without writing it again and again.

## The for loop

```js
for (let i = 1; i <= 3; i++) {
  console.log(`Crate ${i} loaded`);
}
```

```text
Crate 1 loaded
Crate 2 loaded
Crate 3 loaded
```

The three parts in the parentheses, separated by `;`:

1. `let i = 1`: start a counter, once, before anything else;
2. `i <= 3`: check this before each round, and keep going while it's true;
3. `i++`: add 1 to the counter after each round. `i--` takes 1 away.

The code between the braces runs once in every round. `<=` means "less than or equal to". The comparisons are `<`, `>`, `<=` and `>=`.

## Through an array

The counter works perfectly as an index: start at 0, and stop before the length.

```js
const bays = ["Cargo", "Fuel", "Seeds"];
for (let i = 0; i < bays.length; i++) {
  console.log(`Bay ${i + 1}: ${bays[i]}`);
}
```

Write `i < bays.length`, not `<=`, because the last index is one less than the length. Being off by one is the most common loop mistake of all.

## Building a string

A loop can build a string one piece at a time. `+=` adds to what a variable already holds:

```js
let line = "";
for (let i = 3; i >= 1; i--) {
  line += i + " ";
}
console.log(line); // "3 2 1 "
```

## A loop that never ends

If the condition never becomes false, the loop runs forever and the page freezes. Here, the preview stops a loop after two seconds and tells you where it was. In a real browser, the tab just hangs. Check that your counter really moves towards the end.

---

## Mission: Countdown

Launches need a countdown on the crew page.

- On `crew.html`, after the oxygen paragraph, add a sentence that says where the countdown starts: **Launch countdown from 10**, with the number in an element with the id `countdown-from`. Under it, an empty paragraph with the id `countdown`.
- The countdown paragraph shows every number from the starting one down to 1, each followed by a space, then `Liftoff!`: `10 9 8 7 6 5 4 3 2 1 Liftoff!`. Change the start on the page, and the countdown changes with it.
- For the crew's records, the console lists every crew member from the crew list with their place in it, starting at 1: `Crew 1: Mara Vega`, `Crew 2: Tomas Okafor`...
