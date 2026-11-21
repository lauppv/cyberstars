Put wrapper classes, generic classes, generic methods and bounded types to work together in one program

---

## Mission: Storage Lockers

Tommy rents out storage lockers. Some hold crates labelled with names, others hold crates labelled with their weight. He wants one kind of shelf that works for both.

1. Write a generic class `Shelf<T extends Comparable<T>>` that keeps its items in an `ArrayList<T>`. Give it `add(T item)`, `size()`, and `smallest()` and `largest()`, which find the item with `compareTo`
2. Write a generic method `report(String label, Shelf<T> shelf)` that gives back `<label>: N items, smallest X, largest Y`, or `<label>: empty` when the shelf has nothing on it

In `main`, store the names in a `String` array named `names` and the weights in an `Integer` array named `weights`. Put every name on a `Shelf<String>` and every weight on a `Shelf<Integer>`. Print the report for `Names`, then for `Weights`.

**Example** for `names = { "Tommy", "Ken", "Lance" }` and `weights = { 12, 5, 30 }`

```text
Names: 3 items, smallest Ken, largest Tommy
Weights: 3 items, smallest 5, largest 30
```

**Example** for `names = { "Phil" }` and `weights = { }`

```text
Names: 1 items, smallest Phil, largest Phil
Weights: empty
```
