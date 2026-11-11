"Keep stirring **until** the sauce is thick." You don't know how many stirs it takes: you keep going while it's still runny. A `for` loop counts laps you know about. A `while` loop keeps going as long as something is true, however many laps that takes.

## `while`

```js
let water = 10;
let cups = 0;
while (water >= 3) {
  water = water - 3;
  cups = cups + 1;
}
console.log(cups);
```

```text
3
```

Before every lap, `while` asks its question. While the answer is `true`, the block runs again:

- 10 litres: enough for a cup, 7 left, 1 cup;
- 7: another, 4 left, 2 cups;
- 4: another, 1 left, 3 cups;
- 1: not enough. The loop stops.

Nobody said "3 laps". The loop found it out.

## Something must change

A `while` loop only stops when its question turns `false`. So something inside it must change what the question looks at: here, `water` goes down each lap. If nothing changes, the question stays `true`, and the loop never ends. That's the endless loop from part 2, and your preview stops it after 2 seconds.

## Break it on purpose

Forget the line that takes water away:

```js
while (water >= 3) {
  cups = cups + 1;
}
```

`water` stays 10 forever, so the loop never stops. Check every `while` loop: what in it brings the answer closer to `false`?

---

## Mission: Fuel

A shuttle's tank holds some fuel, and the engines burn a fixed amount every minute. How many full minutes can it fly?

**Example**: under the flight count, a paragraph shows:

```text
Fuel: 100 units, burning 15 a minute
Enough fuel for 6 minutes
```

- Under `#flight-count`, a paragraph `Fuel: ` with the units in a `span` with the id `fuel-start`, then `, burning ` and the units per minute in a `span` with the id `burn-rate`, then ` a minute`.
- Under it, a paragraph with the id `fuel` says `Enough fuel for `, the number of whole minutes, and ` minutes`.
- A `while` loop works it out: it takes one minute's fuel away for as long as there is enough fuel left for a whole minute.

Psst, what in your loop brings it closer to stopping? :)
