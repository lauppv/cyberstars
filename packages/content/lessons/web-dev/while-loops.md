A `for` loop is for a number of rounds you know: every item, ten down to one. Sometimes you don't know how many rounds it will take, only when to stop. That's what a `while` loop is for.

## while

```js
let signal = 3;
let relays = 0;
while (signal < 1000) {
  signal = signal * 2; // each relay doubles the signal
  relays++;
}
console.log(`${relays} relays`); // 9 relays
```

The condition is checked before each round. While it's true, the block runs again. Nobody had to work out how many times 3 must double to pass 1000: the loop simply keeps going until it does.

The block **must** change something the condition depends on, here `signal`, or the condition stays true forever. In the preview, a loop that runs for more than two seconds is stopped. In a real browser, the tab freezes.

## for or while

- **`for`** when you know the number of rounds in advance: each item, a count.
- **`while`** when you know when to stop, but not how many rounds: until the fuel runs out, until the target is reached.

Any `for` loop can be written as a `while`, and the other way round. Pick the one that says best what you mean.

---

## Mission: Fuel Gauge

Pilots want to know how long the fuel lasts.

- Under the flight count, add a sentence that says how much fuel there is and how fast it burns: **Fuel: 100 units, burning 15 a minute**, with the two numbers in elements with the ids `fuel-start` and `burn-rate`. Under it, an empty paragraph with the id `fuel`.
- The fuel paragraph says how many minutes the fuel lasts: `Fuel lasts 7 minutes`. Burn it minute by minute until none is left. The last minute counts, even if it burns less than a full minute's worth. When the numbers on the page change, the answer changes too.
