Arrays hold many values. A **loop** does something with each of them, or repeats anything a number of times, without writing it out again and again.

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
2. `i <= 3`: before each round, check this; keep going while it's true;
3. `i++`: after each round, add 1 to the counter. `i--` takes 1 away.

The code between the braces runs once per round. `<=` means "less than or equal": the comparisons are `<`, `>`, `<=`, `>=`.

## Through an array

The counter makes a perfect index: start at 0, stop before the length.

```js
const bays = ["Cargo", "Fuel", "Seeds"];
for (let i = 0; i < bays.length; i++) {
  console.log(`Bay ${i + 1}: ${bays[i]}`);
}
```

`i < bays.length`, not `<=`: the last index is one less than the length. That off-by-one is the most common loop mistake there is.

## Building a string

A loop can grow a string one piece at a time. `+=` adds to what a variable already holds:

```js
let line = "";
for (let i = 3; i >= 1; i--) {
  line += i + " ";
}
console.log(line); // "3 2 1 "
```

## A loop that never ends

If the condition never turns false, the loop runs forever and the page freezes. Here, the preview stops a loop running past two seconds and says where it was; in a real browser, the tab hangs. Check that your counter really moves towards the end.

---

## Mission: Countdown

- On `crew.html`, after the oxygen paragraph, add `<p>Launch countdown from <span id="countdown-from">10</span></p>` and an empty paragraph with the id `countdown`.
- In `crew.js`, read the number to count down from, and with a loop write in the countdown paragraph every number from it down to 1, each followed by a space, then `Liftoff!`: `10 9 8 7 6 5 4 3 2 1 Liftoff!`.
- With another loop, log every crew member from the crew list with their place in it, starting at 1: `Crew 1: Mara Vega`, `Crew 2: Tomas Okafor`...
