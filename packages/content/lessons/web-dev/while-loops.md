A `for` loop is for a known number of rounds: every item, ten to one. Sometimes you don't know how many rounds it will take, only when to stop. That's a `while` loop.

## while

```js
let crates = 40;
let trips = 0;
while (crates > 0) {
  crates -= 12; // a cart carries 12
  trips++;
}
console.log(`${trips} trips`); // 4 trips
```

Before each round, the condition is checked; while it's true, the block runs again. Nobody had to work out 40 / 12 and round it up: the loop simply keeps going until the crates are gone.

The block **must** change something the condition depends on, here `crates`, or the condition stays true forever. In the preview, a loop running past two seconds is stopped; in a real browser, the tab freezes.

## for or while

- **`for`** when you know the rounds in advance: each item, a count.
- **`while`** when you know the stopping point but not the count: until the fuel runs out, until the target is reached.

Any `for` loop can be written as a `while`, and the other way round; pick the one that says what you mean.

---

## Mission: Fuel Gauge

- Under the flight count, add `<p>Fuel: <span id="fuel-start">100</span> units, burning <span id="burn-rate">15</span> a minute</p>` and an empty paragraph with the id `fuel`.
- With a `while` loop, burn the fuel minute by minute until none is left, counting the minutes, and write `Fuel lasts 7 minutes` in the fuel paragraph. The last minute counts even if it burns less than a full minute's worth.
