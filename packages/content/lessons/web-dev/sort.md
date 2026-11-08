The schedule lists flights in the order they were added, not the order they leave. Time to sort them.

## sort and its comparator

```js
const weights = [120, 45, 200];
weights.sort((a, b) => a - b); // [45, 120, 200]
```

`sort` takes a **comparator**: a function that gets two items, `a` and `b`, and returns a number:

- **negative**: `a` goes first;
- **positive**: `b` goes first;
- **zero**: leave them as they are.

`a - b` does exactly that for numbers, smallest first; `b - a` sorts biggest first.

Without a comparator, `sort` compares items **as strings**: `[120, 45, 200].sort()` gives `[120, 200, 45]`, since "1" comes before "2" before "4". Always pass a comparator for numbers.

For strings, `a.localeCompare(b)` returns the right negative, zero or positive number, alphabetically. Times written `HH:MM` with two digits each sort correctly as strings: `"07:15"` comes before `"10:20"`.

```js
crates.sort((a, b) => a.name.localeCompare(b.name));
```

## sort changes the array

Unlike `filter`, `sort` reorders the array **in place**, and returns that same array. To keep the original order too, sort a copy: `[...crates]` makes a new array with the same items.

```js
const byWeight = [...crates].sort((a, b) => a.weight - b.weight);
```

## Reordering the page

`append` **moves** an element that's already on the page. So to reorder rows, sort the row elements, then append each one, in order, to their parent: they end up in the sorted order.

---

## Mission: Departure Order

- Under the on-time flights, add an empty paragraph with the id `last-departure`. Sorting a **copy** of your flights by time, write in it the last one to leave: `Last departure: SL-104 at 11:00`.
- Over the flights table, add a button with the id `sort-by-time` that says **Sort by time**. A click reorders the table's rows by departure time, earliest first.
