The schedule lists flights in the order they were added, not in the order they leave. Time to sort them.

## sort and its comparator

```js
const weights = [120, 45, 200];
weights.sort((a, b) => a - b); // [45, 120, 200]
```

`sort` takes a **comparator**: a function that gets two items, `a` and `b`, and returns a number:

- **negative**: `a` goes first;
- **positive**: `b` goes first;
- **zero**: leave them as they are.

For numbers, `a - b` does exactly that, smallest first. `b - a` sorts the biggest first.

Without a comparator, `sort` compares the items **as strings**: `[120, 45, 200].sort()` gives `[120, 200, 45]`, because "1" comes before "2", and "2" before "4". Always give a comparator for numbers.

For strings, `a.localeCompare(b)` returns the right negative, zero or positive number, in alphabetical order. Times written as `HH:MM`, with two digits each, sort correctly as strings: `"07:15"` comes before `"10:20"`.

```js
crates.sort((a, b) => a.name.localeCompare(b.name));
```

## sort changes the array

Unlike `filter`, `sort` changes the order of the array **itself**, and returns that same array. To keep the original order too, sort a copy: `[...crates]` makes a new array with the same items.

```js
const byWeight = [...crates].sort((a, b) => a.weight - b.weight);
```

## Reordering the page

`append` **moves** an element that's already on the page. So to reorder rows, sort the row elements, then append each one, in order, to their parent. They end up in the sorted order.

---

## Mission: Departure Order

The control room wants the flights in the order they leave.

- Under the on-time flights, add an empty paragraph with the id `last-departure`. It names the last flight to leave today: `Last departure: SL-104 at 11:00`. Working this out must not change the order of your flights for the rest of the script.
- Over the flights table, add a button with the id `sort-by-time` that says **Sort by time**. A click puts the table's rows in order of departure time, the earliest first.
