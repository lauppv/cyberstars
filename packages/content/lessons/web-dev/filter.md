A coffee filter lets the water through and keeps the grounds. An email app's filter shows only the unread messages. Picking the items of a list that pass a test is so common that arrays have a method for it.

## `filter`

```js
function isHigh(score) {
  return score >= 9;
}

const scores = [12, 4, 9, 15, 3];
const high = scores.filter(isHigh);
console.log(high);
```

```text
[12, 9, 15]
```

The question is a function you write: `isHigh` takes one score and returns whether it's at least 9. You hand it to `filter` without brackets, as you hand a function to a button. `filter` calls it once for every item. Each item that gets `true` goes into a **new** array. The others are left out.

The original `scores` doesn't change: `filter` makes a new list.

## On objects

It's even handier on a list of objects:

```js
const players = [
  { name: "Sam", team: "red" },
  { name: "Lea", team: "blue" },
  { name: "Ola", team: "red" },
];
function isRed(player) {
  return player.team === "red";
}
const red = players.filter(isRed);
console.log(red.length);
```

```text
2
```

## Break it on purpose

Forget the comparison:

```js
function isRed(player) {
  return player.team;
}
```

Every player is kept. `player.team` is a word like `"red"` or `"blue"`, never `false`, so every item passes. The question must answer `true` or `false`: compare with `===`.

---

## Mission: On time

The schedule lists the flights that are on time.

**Example**: under `#active-count`, a paragraph says:

```text
On time: SL-102. SL-105.
```

- A paragraph with the id `on-time`.
- With `filter`, the script picks from `flights` the ones whose status is `On time`.
- The paragraph says `On time: `, then each picked flight's code, in the order of the board, each followed by a full stop and a space.

Psst, the question in `filter` answers `true` or `false` :)
