Line up a class by height: you compare two pupils at a time, and swap them if the taller one is in front. Do that enough, and the whole line is in order. `sort` does exactly that, and you tell it how to compare two items.

## `sort` with a comparator

```js
function youngestFirst(a, b) {
  return a - b;
}

const ages = [13, 9, 15, 11];
ages.sort(youngestFirst);
console.log(ages);
```

```text
[9, 11, 13, 15]
```

The function you give `sort` is the **comparator**. `sort` calls it again and again, each time with two items, `a` and `b`, and it answers with a number:

- **negative**: `a` goes first;
- **positive**: `b` goes first;
- **0**: they're equal, leave them.

`a - b` is negative when `a` is smaller, so smaller ages come first. `b - a` would sort the other way, biggest first.

## Sorting strings

Strings can't be taken away from each other, so compare them, and answer with a ternary:

```js
function alphabetical(a, b) {
  return a < b ? -1 : 1;
}

const names = ["Ola", "Sam", "Lea"];
names.sort(alphabetical);
console.log(names);
```

```text
["Lea", "Ola", "Sam"]
```

Times like `"08:30"` sort the same way, since they compare like the clock.

## On objects

Compare a property of each:

```js
function mostPointsFirst(a, b) {
  return b.points - a.points;
}
players.sort(mostPointsFirst);
```

The player with the most points comes first.

## Break it on purpose

Sort numbers without a comparator:

```js
const ages = [9, 13, 100];
ages.sort();
console.log(ages);
```

```text
[100, 13, 9]
```

Without a comparator, `sort` compares the items as **text**, character by character, and `"1"` comes before `"9"`. Numbers always need a comparator.

---

## Mission: The last departure

The schedule says which flight leaves last today.

**Example**: under `#on-time`, a paragraph says:

```text
Last departure: SL-104 at 11:00
```

- A paragraph with the id `last-departure`.
- The script sorts `flights` by departure time, earliest first, with a comparator.
- The paragraph says `Last departure: `, the code of the last flight after sorting, `at` and its time.

Psst, compare the `departs` of `a` and `b` :)
