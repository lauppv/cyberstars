Sort the books on your shelf by colour, and the old order, by author, is gone. If you wanted both, you should have written down the old order first. `sort` is like rearranging the shelf: it changes the array itself.

## `sort` changes the array

```js
function youngestFirst(a, b) {
  return a - b;
}

const ages = [13, 9, 15];
const sorted = ages.sort(youngestFirst);
console.log(sorted);
console.log(ages);
```

```text
[9, 13, 15]
[9, 13, 15]
```

Both are sorted! `sort` doesn't make a new array, unlike `filter`: it rearranges the one you call it on, and gives back that same array. `sorted` and `ages` are two names for one list.

That's a trap when another part of your script still needs the original order: the flights in the order of the board, the players in the order they joined.

## Sort a copy

To keep the original, sort a **copy**. `slice()` with nothing in its brackets makes a copy of an array:

```js
const sorted = ages.slice().sort(youngestFirst);
console.log(sorted);
console.log(ages);
```

```text
[9, 13, 15]
[13, 9, 15]
```

`ages.slice()` is a new array with the same items. Sorting it leaves `ages` alone.

## Break it on purpose

Copy by giving the array a second name:

```js
const copy = ages;
copy.sort(youngestFirst);
console.log(ages);
```

```text
[9, 13, 15]
```

Still sorted. `const copy = ages` doesn't copy anything: it's a second name for the same list, like two labels on one jar. Only `slice()` makes a real copy.

---

## Mission: Keep the board's order

Your script sorted `flights` to find the last departure, and lost the board's order. The rest of the script needs both.

**Example**: when `schedule.html` opens, `#last-departure` still says `Last departure: SL-104 at 11:00`, and the console shows:

```text
First on the board: SL-101
Earliest: SL-103
```

- `flights` keeps the order of the board, and the sorting is done on a copy.
- The console shows `First on the board: ` and the code of the first item of `flights`.
- It shows `Earliest: ` and the code of the first item of the sorted copy.
- `#last-departure` stays as it was.

Psst, `slice()` makes a copy, a second name doesn't :)
