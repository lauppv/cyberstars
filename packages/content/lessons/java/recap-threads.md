Put threads, Runnable, synchronized and a thread pool to work together in one program

---

## Mission: Heist Night

It's heist night in Vice City. Several crews go out at the same time, each doing a few jobs, and all the money goes into one shared stash.

- Write a class `Stash` with a `synchronized` method `add(int amount)` that adds to the total and counts the hauls
- Store the crew names in a `String` array named `crews`, and what each crew takes on each job in an `int[][]` named `hauls`: row `i` belongs to `crews[i]`

Make a pool of 2 threads. Submit one job per crew. The job puts every haul of that crew into the stash, one by one, and gives back the crew's own total. Keep the Futures in a list.

Then print `<crew>: N` for each crew, in order, followed by `Stash: N from K hauls` and `Best crew: <crew>`, the crew with the biggest total. If two crews tie, the first one wins. Shut the pool down. There is always at least one crew.

**Example** for `crews = { "Tommy", "Lance", "Ken" }` and `hauls = { { 500, 200 }, { 100 }, { 300, 300, 100 } }`

```text
Tommy: 700
Lance: 100
Ken: 700
Stash: 1500 from 6 hauls
Best crew: Tommy
```

**Example** for `crews = { "Phil" }` and `hauls = { { } }`

```text
Phil: 0
Stash: 0 from 0 hauls
Best crew: Phil
```
