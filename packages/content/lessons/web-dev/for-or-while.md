A hammer and a screwdriver can both push a screw in, but one is clearly the right tool. `for` and `while` can both repeat things, but each is right for its own job.

## When you know how many: `for`

When the number of laps is known before you start, use `for`: five laps of the track, every item of a list, a countdown from 10.

```js
for (let i = 10; i >= 1; i--) {
  console.log(i);
}
```

Everything about the loop is on its first line: where it starts, when it stops, how it moves.

And for every item of a list, `for...of` is even simpler.

## When you don't: `while`

When you only know **when to stop**, use `while`: until the tank is empty, until the player guesses right, until there's enough money saved.

```js
let savings = 0;
let weeks = 0;
while (savings < 50) {
  savings = savings + 6;
  weeks = weeks + 1;
}
console.log(weeks);
```

```text
9
```

How many weeks to save 50 at 6 a week? The loop finds out.

## A simple test

Ask: "Can I say how many times, before it starts?"

- Yes: `for`.
- No, only when to stop: `while`.

## Break it on purpose

Go through a list with `while`:

```js
let i = 0;
while (i < games.length) {
  console.log(games[i]);
}
```

Endless: the counter never moves, because there's no `i++`. With a `for` loop, the counter's step sits right there on the first line, and is much harder to forget.

---

## Mission: Two loops, two jobs

The schedule page shows the destinations of the day, and how long it takes for the fuel to drop below a safe reserve.

**Example**: under `#fuel`, two paragraphs show:

```text
Destinations: Moon Base. Mars Relay. Europa Outpost. Lunar Gateway. Orbital Yard.
Reserve reached after 5 minutes
```

- A paragraph with the id `destinations` says `Destinations: ` and every destination of the flight table, in order, each followed by a full stop and a space. Use the loop for going through every row.
- A paragraph with the id `reserve` says `Reserve reached after `, the number of minutes, and ` minutes`: how many minutes of burning, from the fuel on the page, it takes for the fuel to drop below 30. Use the loop for "until".

Psst, can you say how many times, before it starts? :)
